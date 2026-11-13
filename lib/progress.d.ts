import { PlayerResearchRegistry } from '@civ-clone/core-science/PlayerResearchRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import City from '@civ-clone/core-city/City';
import Player from '@civ-clone/core-player/Player';
import Yield from '@civ-clone/core-yield/Yield';
/** A city `ProcessYield` effect: the yield goes to the research of the city's player. */
export declare const addResearch: (
  playerResearchRegistry?: PlayerResearchRegistry
) => (cityYield: Yield, city: City) => void;
/**
 * A player `TurnStart` effect: works out again what the advance being researched costs, from the first `Cost` rule's
 * answer, and sets only that (starting the research again would lose its progress). Nothing happens while the player
 * isn't researching, or when no `Cost` rule gives a number.
 */
export declare const updateResearchCost: (
  playerResearchRegistry?: PlayerResearchRegistry,
  ruleRegistry?: RuleRegistry
) => (player: Player) => void;
