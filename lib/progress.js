"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateResearchCost = exports.addResearch = void 0;
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const Cost_1 = require("@civ-clone/core-science/Rules/Cost");
/** A city `ProcessYield` effect: the yield goes to the research of the city's player. */
const addResearch = (playerResearchRegistry = PlayerResearchRegistry_1.instance) => (cityYield, city) => playerResearchRegistry.getByPlayer(city.player()).add(cityYield);
exports.addResearch = addResearch;
/**
 * A player `TurnStart` effect: works out again what the advance being researched costs, from the first `Cost` rule's
 * answer, and sets only that (starting the research again would lose its progress). Nothing happens while the player
 * isn't researching, or when no `Cost` rule gives a number.
 */
const updateResearchCost = (playerResearchRegistry = PlayerResearchRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance) => (player) => {
    const playerResearch = playerResearchRegistry.getByPlayer(player), researching = playerResearch.researching();
    if (researching === null) {
        return;
    }
    const [cost] = ruleRegistry.process(Cost_1.default, researching, playerResearch);
    if (typeof cost === 'number') {
        playerResearch.cost().set(cost);
    }
};
exports.updateResearchCost = updateResearchCost;
//# sourceMappingURL=progress.js.map