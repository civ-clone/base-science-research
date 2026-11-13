import Advance from '@civ-clone/core-science/Advance';
import Engine from '@civ-clone/core-engine/Engine';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';

/** A research `Started` effect: tells the engine's listeners (`player:research`). */
export const emitResearchStarted =
  (
    engine: Engine
  ): ((
    playerResearch: PlayerResearch,
    AdvanceToResearch: typeof Advance
  ) => void) =>
  (playerResearch: PlayerResearch, AdvanceToResearch: typeof Advance): void => {
    engine.emit('player:research', playerResearch, AdvanceToResearch);
  };

/** A research `Complete` effect: tells the engine's listeners (`player:research-complete`). */
export const emitResearchComplete =
  (
    engine: Engine
  ): ((playerResearch: PlayerResearch, advance: Advance) => void) =>
  (playerResearch: PlayerResearch, advance: Advance): void => {
    engine.emit('player:research-complete', playerResearch, advance);
  };
