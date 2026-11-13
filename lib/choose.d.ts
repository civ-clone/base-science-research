import { PlayerResearchRegistry } from '@civ-clone/core-science/PlayerResearchRegistry';
import Player from '@civ-clone/core-player/Player';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
/** The `PlayerAction` a ruleset offers for choosing what to research next. Its value is the `PlayerResearch`. */
export type ChooseResearchType = new (
  player: Player,
  playerResearch: PlayerResearch
) => PlayerAction;
/** A player `Action` criterion: the player isn't researching anything. */
export declare const notResearching: (
  playerResearchRegistry?: PlayerResearchRegistry
) => (player: Player) => boolean;
/** A player `Action` criterion: there's something the player could research. */
export declare const canResearch: (
  playerResearchRegistry?: PlayerResearchRegistry
) => (player: Player) => boolean;
/** A player `Action` effect: the player chooses what to research, through the ruleset's `ChooseResearch`. */
export declare const chooseResearch: (
  ChooseResearch: ChooseResearchType,
  playerResearchRegistry?: PlayerResearchRegistry
) => (player: Player) => PlayerAction[];
