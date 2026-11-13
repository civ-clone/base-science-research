import {
  AdvanceRegistry,
  instance as advanceRegistryInstance,
} from '@civ-clone/core-science/AdvanceRegistry';
import {
  PlayerResearchRegistry,
  instance as playerResearchRegistryInstance,
} from '@civ-clone/core-science/PlayerResearchRegistry';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import Player from '@civ-clone/core-player/Player';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';

/** Gives `player` a `PlayerResearch` and registers it. */
export const addPlayerResearch = (
  player: Player,
  advanceRegistry: AdvanceRegistry = advanceRegistryInstance,
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance
): void =>
  playerResearchRegistry.register(
    new PlayerResearch(player, advanceRegistry, ruleRegistry)
  );

/**
 * Gives `player` up to `Math.floor(upTo * rng())` advances to start with (never more than are available), each picked
 * at random from what the player could research at that point. The first number drawn sets the count; each pick then
 * draws one more.
 */
export const addStartingAdvances = (
  player: Player,
  upTo: number,
  randomNumberGenerator: () => number,
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance
): void => {
  const playerResearch = playerResearchRegistry.getByPlayer(player);

  for (
    let i = 0,
      max = Math.min(
        playerResearch.available().length,
        Math.floor(upTo * randomNumberGenerator())
      );
    i < max;
    i++
  ) {
    const available = playerResearch.available();

    playerResearch.addAdvance(
      available[Math.floor(randomNumberGenerator() * available.length)]
    );
  }
};
