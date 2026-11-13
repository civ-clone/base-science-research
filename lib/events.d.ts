import Advance from '@civ-clone/core-science/Advance';
import Engine from '@civ-clone/core-engine/Engine';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
/** A research `Started` effect: tells the engine's listeners (`player:research`). */
export declare const emitResearchStarted: (
  engine: Engine
) => (
  playerResearch: PlayerResearch,
  AdvanceToResearch: typeof Advance
) => void;
/** A research `Complete` effect: tells the engine's listeners (`player:research-complete`). */
export declare const emitResearchComplete: (
  engine: Engine
) => (playerResearch: PlayerResearch, advance: Advance) => void;
