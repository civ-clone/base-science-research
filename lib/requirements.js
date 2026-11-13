"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deriveRequirementsRules = exports.requirementsRulesFor = void 0;
const Requirement_1 = require("@civ-clone/core-requirement/Requirement");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Requirements_1 = require("@civ-clone/core-science/Rules/Requirements");
/** The rule `entry` is played by: its subject can be researched once the player has discovered the advances it needs. */
const requirementsRulesFor = (entry) => entry.relation === 'requires'
    ? [
        new Requirements_1.default(entry.id, new Criterion_1.default((CheckAdvance) => CheckAdvance === entry.subject), new Effect_1.default((CheckAdvance, discoveredAdvances) => (0, Requirement_1.met)(entry, (target) => discoveredAdvances.some((advance) => advance instanceof target)))),
    ]
    : [];
exports.requirementsRulesFor = requirementsRulesFor;
/** What a ruleset gives the game's `requirements` to make each entry's rule with. */
const deriveRequirementsRules = (entry) => (0, exports.requirementsRulesFor)(entry);
exports.deriveRequirementsRules = deriveRequirementsRules;
//# sourceMappingURL=requirements.js.map