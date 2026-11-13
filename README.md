# base-science-research

The research wiring, for a ruleset to wrap in its own `Added`, `Action`, `ProcessYield`, `TurnStart`, `Started`,
`Complete`, `Captured` and `Requirements` rules with its own ids, numbers and criteria:

- `lib/playerResearch`: `addPlayerResearch(player, …)` gives a player a `PlayerResearch`; `addStartingAdvances(player,
  upTo, rng, …)` gives up to `Math.floor(upTo * rng())` random advances from those available.
- `lib/choose`: `notResearching` and `canResearch`, criteria, and `chooseResearch(ChooseResearch, …)`, the effect that
  offers the ruleset's `ChooseResearch` player action.
- `lib/progress`: `addResearch(…)`, a `ProcessYield` effect adding a city's research to its player's, and
  `updateResearchCost(…)`, a `TurnStart` effect that works out the cost of the advance being researched again.
- `lib/events`: `emitResearchStarted` (`player:research`) and `emitResearchComplete` (`player:research-complete`).
- `lib/captured`: `hasAdvanceToTake` and `takeAdvance`, the captor of a city choosing one of the previous owner's
  advances it lacks (`capture-city.steal-advance`).
- `lib/requirements`: `requirementsRulesFor(entry)` and `deriveRequirementsRules`, the `Requirements` rule a
  requirement entry ("advance requires advances") is played by.

A library: it registers no rules. See `civ1-science` for Civilization's costs, starting advances and ids.
