import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
/**
 * How many advances `playerResearch` has gained in play: every one it knows but those it started with
 *  (`PlayerResearch#startingAdvances()`), Future Technologies and advances taken from others included. An
 *  `AdvanceCount` for a ruleset that counts as Civilization does (civ-clone/web-renderer#973).
 */
export declare const gainedInPlay: (playerResearch: PlayerResearch) => number;
export default gainedInPlay;
