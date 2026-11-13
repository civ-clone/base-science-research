"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addStartingAdvances = exports.addPlayerResearch = void 0;
const AdvanceRegistry_1 = require("@civ-clone/core-science/AdvanceRegistry");
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const PlayerResearch_1 = require("@civ-clone/core-science/PlayerResearch");
/** Gives `player` a `PlayerResearch` and registers it. */
const addPlayerResearch = (player, advanceRegistry = AdvanceRegistry_1.instance, playerResearchRegistry = PlayerResearchRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance) => playerResearchRegistry.register(new PlayerResearch_1.default(player, advanceRegistry, ruleRegistry));
exports.addPlayerResearch = addPlayerResearch;
/**
 * Gives `player` up to `Math.floor(upTo * rng())` advances to start with (never more than are available), each picked
 * at random from what the player could research at that point. The first number drawn sets the count; each pick then
 * draws one more.
 */
const addStartingAdvances = (player, upTo, randomNumberGenerator, playerResearchRegistry = PlayerResearchRegistry_1.instance) => {
    const playerResearch = playerResearchRegistry.getByPlayer(player);
    for (let i = 0, max = Math.min(playerResearch.available().length, Math.floor(upTo * randomNumberGenerator())); i < max; i++) {
        const available = playerResearch.available();
        playerResearch.addAdvance(available[Math.floor(randomNumberGenerator() * available.length)]);
    }
};
exports.addStartingAdvances = addStartingAdvances;
//# sourceMappingURL=playerResearch.js.map