import { AdvanceRegistry } from '@civ-clone/core-science/AdvanceRegistry';
import { PlayerResearchRegistry } from '@civ-clone/core-science/PlayerResearchRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import Player from '@civ-clone/core-player/Player';
/** Gives `player` a `PlayerResearch` and registers it. */
export declare const addPlayerResearch: (
  player: Player,
  advanceRegistry?: AdvanceRegistry,
  playerResearchRegistry?: PlayerResearchRegistry,
  ruleRegistry?: RuleRegistry
) => void;
/**
 * Gives `player` up to `Math.floor(upTo * rng())` advances to start with (never more than are available), each picked
 * at random from what the player could research at that point. The first number drawn sets the count; each pick then
 * draws one more.
 */
export declare const addStartingAdvances: (
  player: Player,
  upTo: number,
  randomNumberGenerator: () => number,
  playerResearchRegistry?: PlayerResearchRegistry
) => void;
