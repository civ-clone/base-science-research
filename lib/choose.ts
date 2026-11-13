import {
  PlayerResearchRegistry,
  instance as playerResearchRegistryInstance,
} from '@civ-clone/core-science/PlayerResearchRegistry';
import Player from '@civ-clone/core-player/Player';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';

/** The `PlayerAction` a ruleset offers for choosing what to research next. Its value is the `PlayerResearch`. */
export type ChooseResearchType = new (
  player: Player,
  playerResearch: PlayerResearch
) => PlayerAction;

/** A player `Action` criterion: the player isn't researching anything. */
export const notResearching =
  (
    playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance
  ): ((player: Player) => boolean) =>
  (player: Player): boolean =>
    playerResearchRegistry.getByPlayer(player).researching() === null;

/** A player `Action` criterion: there's something the player could research. */
export const canResearch =
  (
    playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance
  ): ((player: Player) => boolean) =>
  (player: Player): boolean =>
    playerResearchRegistry.getByPlayer(player).available().length > 0;

/** A player `Action` effect: the player chooses what to research, through the ruleset's `ChooseResearch`. */
export const chooseResearch =
  (
    ChooseResearch: ChooseResearchType,
    playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance
  ): ((player: Player) => PlayerAction[]) =>
  (player: Player): PlayerAction[] =>
    [new ChooseResearch(player, playerResearchRegistry.getByPlayer(player))];
