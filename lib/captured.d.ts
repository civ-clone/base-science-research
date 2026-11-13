import { ClientRegistry } from '@civ-clone/core-client/ClientRegistry';
import { PlayerResearchRegistry } from '@civ-clone/core-science/PlayerResearchRegistry';
import Advance from '@civ-clone/core-science/Advance';
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
export declare const hasAdvanceToTake: (
  playerResearchRegistry?: PlayerResearchRegistry
) => (capturedCity: City, capturingPlayer: Player, player: Player) => boolean;
/**
 * A city `Captured` effect: the captor's client chooses one of those advances (`capture-city.steal-advance`), and the
 * captor learns it.
 */
export declare const takeAdvance: (
  playerResearchRegistry?: PlayerResearchRegistry,
  clientRegistry?: ClientRegistry
) => (
  capturedCity: City,
  capturingPlayer: Player,
  player: Player
) => Promise<void>;
