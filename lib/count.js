"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gainedInPlay = void 0;
/**
 * How many advances `playerResearch` has gained in play: every one it knows but those it started with
 *  (`PlayerResearch#startingAdvances()`), Future Technologies and advances taken from others included. An
 *  `AdvanceCount` for a ruleset that counts as Civilization does (civ-clone/web-renderer#973).
 */
const gainedInPlay = (playerResearch) => playerResearch.complete().length - playerResearch.startingAdvances().length;
exports.gainedInPlay = gainedInPlay;
exports.default = exports.gainedInPlay;
//# sourceMappingURL=count.js.map