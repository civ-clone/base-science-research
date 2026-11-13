import { Requirement } from '@civ-clone/core-requirement/Requirement';
import { Deriver } from '@civ-clone/core-requirement/RequirementRegistry';
import Requirements from '@civ-clone/core-science/Rules/Requirements';
/** The rule `entry` is played by: its subject can be researched once the player has discovered the advances it needs. */
export declare const requirementsRulesFor: (
  entry: Requirement
) => Requirements[];
/** What a ruleset gives the game's `requirements` to make each entry's rule with. */
export declare const deriveRequirementsRules: Deriver;
