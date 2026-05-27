// gameSession/state/StateRegistry.ts

import { IGameState } from "../IGameState";
import { IGameSession } from "../../IGameSession";
import { MainMenuState } from "./MainMenuState";
import { StartMenuState } from "./StartMenuState";
import { CharacterCreationState } from "./CharacterCreationState";
import { BattleState } from "./BattleState";
import { IEnemyCharacter, IPlayerCharacter } from "../../../character";

type StateFactory = () => IGameState;

const states = {
  start_menu: () => new StartMenuState(),
  main_menu: () => new MainMenuState(),
  character_creation: () => new CharacterCreationState(),
  // battle: () => new BattleState(),
} satisfies Record<string, StateFactory>;

export type GameStateId = keyof typeof states;

export class StateRegistry {
  private static states = states;

  public static create(stateId: GameStateId): IGameState {
    const factory = this.states[stateId];

    if (!factory) {
      throw new Error(`Game state "${stateId}" does not exist.`);
    }

    return factory();
  }
  public static createBattle(enemies: IEnemyCharacter[], session: IGameSession): BattleState {
    return new BattleState(enemies, session);
  }
}
