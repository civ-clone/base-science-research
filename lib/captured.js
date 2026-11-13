"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.takeAdvance = exports.hasAdvanceToTake = void 0;
const ClientRegistry_1 = require("@civ-clone/core-client/ClientRegistry");
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const ChoiceMeta_1 = require("@civ-clone/core-client/ChoiceMeta");
/**
 * A city `Captured` criterion: the city's previous owner knows an advance the captor doesn't, and that can't be
 * repeated.
 */
const hasAdvanceToTake = (playerResearchRegistry = PlayerResearchRegistry_1.instance) => (capturedCity, capturingPlayer, player) => playerResearchRegistry
    .getByPlayer(player)
    .complete()
    .some((advance) => !advance.constructor.repeatable &&
    !playerResearchRegistry
        .getByPlayer(capturingPlayer)
        .completed(advance.constructor));
exports.hasAdvanceToTake = hasAdvanceToTake;
/**
 * A city `Captured` effect: the captor's client chooses one of those advances (`capture-city.steal-advance`), and the
 * captor learns it.
 */
const takeAdvance = (playerResearchRegistry = PlayerResearchRegistry_1.instance, clientRegistry = ClientRegistry_1.instance) => async (capturedCity, capturingPlayer, player) => {
    const capturingPlayerResearch = playerResearchRegistry.getByPlayer(capturingPlayer);
    const available = playerResearchRegistry
        .getByPlayer(player)
        .complete()
        .map((advance) => advance.sourceClass())
        .filter((AdvanceType) => !AdvanceType.repeatable &&
        !capturingPlayerResearch.completed(AdvanceType)), client = clientRegistry.getByPlayer(capturingPlayer), ChosenAdvance = await client.chooseFromList(new ChoiceMeta_1.default(available, 'capture-city.steal-advance', capturedCity));
    capturingPlayerResearch.addAdvance(ChosenAdvance);
};
exports.takeAdvance = takeAdvance;
//# sourceMappingURL=captured.js.map