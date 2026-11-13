import {
  ClientRegistry,
  instance as clientRegistryInstance,
} from '@civ-clone/core-client/ClientRegistry';
import {
  PlayerResearchRegistry,
  instance as playerResearchRegistryInstance,
} from '@civ-clone/core-science/PlayerResearchRegistry';
import Advance from '@civ-clone/core-science/Advance';
import ChoiceMeta from '@civ-clone/core-client/ChoiceMeta';
import City from '@civ-clone/core-city/City';
import Player from '@civ-clone/core-player/Player';

declare global {
  interface ChoiceMetaDataMap {
    'capture-city.steal-advance': typeof Advance;
  }
}

/**
 * A city `Captured` criterion: the city's previous owner knows an advance the captor doesn't, and that can't be
 * repeated.
 */
export const hasAdvanceToTake =
  (
    playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance
  ): ((
    capturedCity: City,
    capturingPlayer: Player,
    player: Player
  ) => boolean) =>
  (capturedCity: City, capturingPlayer: Player, player: Player): boolean =>
    playerResearchRegistry
      .getByPlayer(player)
      .complete()
      .some(
        (advance) =>
          !(advance.constructor as typeof Advance).repeatable &&
          !playerResearchRegistry
            .getByPlayer(capturingPlayer)
            .completed(advance.constructor as typeof Advance)
      );

/**
 * A city `Captured` effect: the captor's client chooses one of those advances (`capture-city.steal-advance`), and the
 * captor learns it.
 */
export const takeAdvance =
  (
    playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance,
    clientRegistry: ClientRegistry = clientRegistryInstance
  ): ((
    capturedCity: City,
    capturingPlayer: Player,
    player: Player
  ) => Promise<void>) =>
  async (
    capturedCity: City,
    capturingPlayer: Player,
    player: Player
  ): Promise<void> => {
    const capturingPlayerResearch =
      playerResearchRegistry.getByPlayer(capturingPlayer);
    const available = playerResearchRegistry
        .getByPlayer(player)
        .complete()
        .map((advance) => advance.sourceClass() as typeof Advance)
        .filter(
          (AdvanceType) =>
            !AdvanceType.repeatable &&
            !capturingPlayerResearch.completed(AdvanceType)
        ),
      client = clientRegistry.getByPlayer(capturingPlayer),
      ChosenAdvance = await client.chooseFromList(
        new ChoiceMeta(available, 'capture-city.steal-advance', capturedCity)
      );

    capturingPlayerResearch.addAdvance(ChosenAdvance);
  };
