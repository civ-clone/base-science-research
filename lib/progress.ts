import {
  PlayerResearchRegistry,
  instance as playerResearchRegistryInstance,
} from '@civ-clone/core-science/PlayerResearchRegistry';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import City from '@civ-clone/core-city/City';
import Cost from '@civ-clone/core-science/Rules/Cost';
import Player from '@civ-clone/core-player/Player';
import Yield from '@civ-clone/core-yield/Yield';

/** A city `ProcessYield` effect: the yield goes to the research of the city's player. */
export const addResearch =
  (
    playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance
  ): ((cityYield: Yield, city: City) => void) =>
  (cityYield: Yield, city: City): void =>
    playerResearchRegistry.getByPlayer(city.player()).add(cityYield);

/**
 * A player `TurnStart` effect: works out again what the advance being researched costs, from the first `Cost` rule's
 * answer, and sets only that (starting the research again would lose its progress). Nothing happens while the player
 * isn't researching, or when no `Cost` rule gives a number.
 */
export const updateResearchCost =
  (
    playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance,
    ruleRegistry: RuleRegistry = ruleRegistryInstance
  ): ((player: Player) => void) =>
  (player: Player): void => {
    const playerResearch = playerResearchRegistry.getByPlayer(player),
      researching = playerResearch.researching();

    if (researching === null) {
      return;
    }

    const [cost] = ruleRegistry.process(Cost, researching, playerResearch);

    if (typeof cost === 'number') {
      playerResearch.cost().set(cost);
    }
  };
