"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chooseResearch = exports.canResearch = exports.notResearching = void 0;
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
/** A player `Action` criterion: the player isn't researching anything. */
const notResearching = (playerResearchRegistry = PlayerResearchRegistry_1.instance) => (player) => playerResearchRegistry.getByPlayer(player).researching() === null;
exports.notResearching = notResearching;
/** A player `Action` criterion: there's something the player could research. */
const canResearch = (playerResearchRegistry = PlayerResearchRegistry_1.instance) => (player) => playerResearchRegistry.getByPlayer(player).available().length > 0;
exports.canResearch = canResearch;
/** A player `Action` effect: the player chooses what to research, through the ruleset's `ChooseResearch`. */
const chooseResearch = (ChooseResearch, playerResearchRegistry = PlayerResearchRegistry_1.instance) => (player) => [new ChooseResearch(player, playerResearchRegistry.getByPlayer(player))];
exports.chooseResearch = chooseResearch;
//# sourceMappingURL=choose.js.map