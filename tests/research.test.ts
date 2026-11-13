import { addPlayerResearch, addStartingAdvances } from '../lib/playerResearch';
import { addResearch, updateResearchCost } from '../lib/progress';
import { canResearch, chooseResearch, notResearching } from '../lib/choose';
import {
  deriveRequirementsRules,
  requirementsRulesFor,
} from '../lib/requirements';
import { emitResearchComplete, emitResearchStarted } from '../lib/events';
import { hasAdvanceToTake, takeAdvance } from '../lib/captured';
import Advance from '@civ-clone/core-science/Advance';
import AdvanceRegistry from '@civ-clone/core-science/AdvanceRegistry';
import ChoiceMeta from '@civ-clone/core-client/ChoiceMeta';
import City from '@civ-clone/core-city/City';
import ClientRegistry from '@civ-clone/core-client/ClientRegistry';
import Cost from '@civ-clone/core-science/Rules/Cost';
import Effect from '@civ-clone/core-rule/Effect';
import Engine from '@civ-clone/core-engine/Engine';
import Player from '@civ-clone/core-player/Player';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import PlayerResearchRegistry from '@civ-clone/core-science/PlayerResearchRegistry';
import Requirement from '@civ-clone/core-requirement/Requirement';
import Requirements from '@civ-clone/core-science/Rules/Requirements';
import Research from '@civ-clone/core-science/Yields/Research';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import { expect } from 'chai';

class Fire extends Advance {}
class Wheel extends Advance {}
class Writing extends Advance {}
class Bronze extends Advance {}
class Beyond extends Advance {
  static readonly repeatable = true;
}
class Choose extends PlayerAction<PlayerResearch> {}

const setUp = (...advances: (typeof Advance)[]) => {
  const ruleRegistry = new RuleRegistry(),
    advanceRegistry = new AdvanceRegistry(),
    playerResearchRegistry = new PlayerResearchRegistry(),
    player = new Player(ruleRegistry);

  advanceRegistry.register(...advances);

  addPlayerResearch(
    player,
    advanceRegistry,
    playerResearchRegistry,
    ruleRegistry
  );

  return {
    advanceRegistry,
    player,
    playerResearch: playerResearchRegistry.getByPlayer(player),
    playerResearchRegistry,
    ruleRegistry,
  };
};

const sequence = (...values: number[]) => {
  const drawn: number[] = [];

  return {
    drawn,
    rng: (): number => {
      const value = values.shift();

      if (value === undefined) {
        throw new Error('drew too many numbers');
      }

      drawn.push(value);

      return value;
    },
  };
};

describe('addPlayerResearch', (): void => {
  it("registers the player's research, over the game's advances and rules", (): void => {
    const { player, playerResearch, playerResearchRegistry } = setUp(
      Fire,
      Wheel
    );

    expect(playerResearch).to.be.instanceOf(PlayerResearch);
    expect(playerResearch.player()).to.equal(player);
    expect(playerResearch.available()).to.deep.equal([Fire, Wheel]);
    expect(playerResearchRegistry.entries()).to.have.length(1);
  });
});

describe('addStartingAdvances', (): void => {
  it('draws the count first, then one number for each pick, from what is available at the time', (): void => {
    const { player, playerResearch, playerResearchRegistry } = setUp(
        Fire,
        Wheel,
        Writing,
        Bronze
      ),
      { drawn, rng } = sequence(0.75, 0.99, 0, 0.5);

    addStartingAdvances(player, 4, rng, playerResearchRegistry);

    // floor(4 * 0.75) = 3 picks: Bronze of 4, then Fire of 3, then Writing of 2 (Wheel, Writing).
    expect(
      playerResearch.complete().map((advance) => advance.constructor)
    ).to.deep.equal([Bronze, Fire, Writing]);
    expect(drawn).to.deep.equal([0.75, 0.99, 0, 0.5]);
  });

  it('never gives more than are available, and draws nothing more when it gives none', (): void => {
    const first = setUp(Fire),
      many = sequence(0.99, 0);

    addStartingAdvances(
      first.player,
      4,
      many.rng,
      first.playerResearchRegistry
    );

    expect(
      first.playerResearch.complete().map((advance) => advance.constructor)
    ).to.deep.equal([Fire]);
    expect(many.drawn).to.deep.equal([0.99, 0]);

    const none = setUp(Fire, Wheel),
      zero = sequence(0.2);

    addStartingAdvances(none.player, 4, zero.rng, none.playerResearchRegistry);

    expect(none.playerResearch.complete()).to.deep.equal([]);
    expect(zero.drawn).to.deep.equal([0.2]);
  });

  it('scales the count by upTo', (): void => {
    const { player, playerResearch, playerResearchRegistry } = setUp(
      Fire,
      Wheel,
      Writing,
      Bronze
    );

    addStartingAdvances(
      player,
      2,
      sequence(0.75, 0, 0).rng,
      playerResearchRegistry
    );

    expect(playerResearch.complete()).to.have.length(1);
  });
});

describe('choosing research', (): void => {
  it('is offered while nothing is being researched and something can be', (): void => {
    const { player, playerResearch, playerResearchRegistry } = setUp(Fire);

    expect(notResearching(playerResearchRegistry)(player)).true;
    expect(canResearch(playerResearchRegistry)(player)).true;

    playerResearch.research(Fire);

    expect(notResearching(playerResearchRegistry)(player)).false;

    playerResearch.addAdvance(Fire);

    expect(notResearching(playerResearchRegistry)(player)).true;
    expect(canResearch(playerResearchRegistry)(player)).false;
  });

  it("offers the ruleset's action, holding the player's research", (): void => {
    const { player, playerResearch, playerResearchRegistry } = setUp(Fire),
      actions = chooseResearch(Choose, playerResearchRegistry)(player);

    expect(actions).to.have.length(1);
    expect(actions[0]).to.be.instanceOf(Choose);
    expect(actions[0].player()).to.equal(player);
    expect(actions[0].value()).to.equal(playerResearch);
  });
});

describe('addResearch', (): void => {
  it("adds the yield to the city's player's research", (): void => {
    const { player, playerResearch, playerResearchRegistry } = setUp(Fire),
      city = { player: () => player } as unknown as City;

    addResearch(playerResearchRegistry)(new Research(3), city);
    addResearch(playerResearchRegistry)(new Research(4), city);

    expect(playerResearch.progress().value()).to.equal(7);
  });
});

describe('updateResearchCost', (): void => {
  it("sets the cost of the advance being researched from the first Cost rule's number, and nothing else", (): void => {
    const { player, playerResearch, playerResearchRegistry, ruleRegistry } =
        setUp(Fire),
      asked: [typeof Advance, PlayerResearch][] = [];
    let cost: unknown = 10;

    ruleRegistry.register(
      new Cost(
        new Effect((CostAdvance: typeof Advance, research: PlayerResearch) => {
          asked.push([CostAdvance, research]);

          return cost as number;
        })
      )
    );

    const update = updateResearchCost(playerResearchRegistry, ruleRegistry);

    update(player);

    expect(asked).to.deep.equal([]);

    playerResearch.research(Fire);
    playerResearch.add(new Research(4));
    cost = 30;
    update(player);

    expect(playerResearch.cost().value()).to.equal(30);
    expect(playerResearch.progress().value()).to.equal(4);
    expect(playerResearch.researching()).to.equal(Fire);
    expect(asked[asked.length - 1]).to.deep.equal([Fire, playerResearch]);

    cost = 'not a number';
    update(player);

    expect(playerResearch.cost().value()).to.equal(30);
  });
});

describe('the research events', (): void => {
  it('tell the listeners', (): void => {
    const engine = new Engine(),
      { playerResearch } = setUp(Fire),
      fire = new Fire(),
      seen: unknown[][] = [];

    engine.on('player:research', (...args: unknown[]) =>
      seen.push(['started', ...args])
    );
    engine.on('player:research-complete', (...args: unknown[]) =>
      seen.push(['complete', ...args])
    );

    emitResearchStarted(engine)(playerResearch, Fire);
    emitResearchComplete(engine)(playerResearch, fire);

    expect(seen).to.deep.equal([
      ['started', playerResearch, Fire],
      ['complete', playerResearch, fire],
    ]);
  });
});

describe('taking an advance with a captured city', (): void => {
  const setUpCapture = () => {
    const ruleRegistry = new RuleRegistry(),
      advanceRegistry = new AdvanceRegistry(),
      playerResearchRegistry = new PlayerResearchRegistry(),
      captor = new Player(ruleRegistry),
      owner = new Player(ruleRegistry),
      city = {} as City,
      offered: ChoiceMeta<'capture-city.steal-advance'>[] = [];

    advanceRegistry.register(Fire, Wheel, Writing, Beyond);

    [captor, owner].forEach((player) =>
      addPlayerResearch(
        player,
        advanceRegistry,
        playerResearchRegistry,
        ruleRegistry
      )
    );

    const clientRegistry = {
      getByPlayer: (player: Player) => ({
        chooseFromList: async (
          meta: ChoiceMeta<'capture-city.steal-advance'>
        ): Promise<typeof Advance> => {
          expect(player).to.equal(captor);
          offered.push(meta);

          return meta.choices()[meta.choices().length - 1].value();
        },
      }),
    } as unknown as ClientRegistry;

    return {
      captor,
      captorResearch: playerResearchRegistry.getByPlayer(captor),
      city,
      clientRegistry,
      offered,
      owner,
      ownerResearch: playerResearchRegistry.getByPlayer(owner),
      playerResearchRegistry,
    };
  };

  it("is possible while the owner knows an advance the captor doesn't, never a repeatable one", (): void => {
    const {
        captor,
        captorResearch,
        city,
        owner,
        ownerResearch,
        playerResearchRegistry,
      } = setUpCapture(),
      can = (): boolean =>
        hasAdvanceToTake(playerResearchRegistry)(city, captor, owner);

    expect(can()).false;

    ownerResearch.addAdvance(Beyond);

    expect(can()).false;

    ownerResearch.addAdvance(Fire);

    expect(can()).true;

    captorResearch.addAdvance(Fire);

    expect(can()).false;
  });

  it("lets the captor's client choose from those advances, in the owner's order, and the captor learns it", async (): Promise<void> => {
    const {
      captor,
      captorResearch,
      city,
      clientRegistry,
      offered,
      owner,
      ownerResearch,
      playerResearchRegistry,
    } = setUpCapture();

    ownerResearch.addAdvance(Writing);
    ownerResearch.addAdvance(Beyond);
    ownerResearch.addAdvance(Fire);
    ownerResearch.addAdvance(Wheel);
    captorResearch.addAdvance(Fire);

    await takeAdvance(playerResearchRegistry, clientRegistry)(
      city,
      captor,
      owner
    );

    expect(offered).to.have.length(1);
    expect(offered[0].key()).to.equal('capture-city.steal-advance');
    expect(offered[0].data()).to.equal(city);
    expect(offered[0].choices().map((choice) => choice.value())).to.deep.equal([
      Writing,
      Wheel,
    ]);
    expect(captorResearch.completed(Wheel)).true;
    expect(captorResearch.completed(Writing)).false;
  });
});

describe('requirementsRulesFor', (): void => {
  it('makes a rule with the entry’s id: its subject can be researched once the advances it requires are known', (): void => {
    const [rule] = requirementsRulesFor(
      new Requirement({
        id: 'test:writing',
        relation: 'requires',
        subject: Writing,
        targets: [Fire, Wheel],
      } as any)
    );

    expect(rule).to.be.instanceOf(Requirements);
    expect(rule.id()).to.equal('test:writing');
    expect(rule.validate(Writing, [])).true;
    expect(rule.validate(Fire, [])).false;
    expect(rule.process(Writing, [new Fire()])).false;
    expect(rule.process(Writing, [new Fire(), new Wheel()])).true;
    expect(deriveRequirementsRules).to.be.a('function');
  });

  it('makes nothing for other relations', (): void => {
    expect(
      requirementsRulesFor(
        new Requirement({
          id: 'test:x',
          relation: 'obsoletes',
          subject: Writing,
          targets: [Fire],
        } as any)
      )
    ).to.deep.equal([]);
  });
});
