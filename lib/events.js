"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitResearchComplete = exports.emitResearchStarted = void 0;
/** A research `Started` effect: tells the engine's listeners (`player:research`). */
const emitResearchStarted = (engine) => (playerResearch, AdvanceToResearch) => {
    engine.emit('player:research', playerResearch, AdvanceToResearch);
};
exports.emitResearchStarted = emitResearchStarted;
/** A research `Complete` effect: tells the engine's listeners (`player:research-complete`). */
const emitResearchComplete = (engine) => (playerResearch, advance) => {
    engine.emit('player:research-complete', playerResearch, advance);
};
exports.emitResearchComplete = emitResearchComplete;
//# sourceMappingURL=events.js.map