import {
  Requirement,
  Target,
  met,
} from '@civ-clone/core-requirement/Requirement';
import Advance from '@civ-clone/core-science/Advance';
import Criterion from '@civ-clone/core-rule/Criterion';
import { Deriver } from '@civ-clone/core-requirement/RequirementRegistry';
import Effect from '@civ-clone/core-rule/Effect';
import Requirements from '@civ-clone/core-science/Rules/Requirements';

/** The rule `entry` is played by: its subject can be researched once the player has discovered the advances it needs. */
export const requirementsRulesFor = (entry: Requirement): Requirements[] =>
  entry.relation === 'requires'
    ? [
        new Requirements(
          entry.id,
          new Criterion(
            (CheckAdvance: typeof Advance): boolean =>
              CheckAdvance === entry.subject
          ),
          new Effect(
            (
              CheckAdvance: typeof Advance,
              discoveredAdvances: Advance[]
            ): boolean =>
              met(entry, (target: Target): boolean =>
                discoveredAdvances.some(
                  (advance: Advance): boolean =>
                    advance instanceof (target as typeof Advance)
                )
              )
          )
        ),
      ]
    : [];

/** What a ruleset gives the game's `requirements` to make each entry's rule with. */
export const deriveRequirementsRules: Deriver = (
  entry: Requirement
): Requirements[] => requirementsRulesFor(entry);
