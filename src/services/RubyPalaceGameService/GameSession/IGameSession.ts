import { IGameState, CharacterCreationDraft, GameActionResult } from "./index";

export interface IGameSession {
  readonly userId: string;
  readonly createdAt: Date;
  lastActiveAt: Date;

  touch(): void;

  getState(): IGameState;

  setState(state: IGameState): void;

  handleAction(action: string): Promise<GameActionResult>;
  getCharacterCreationDraft(): CharacterCreationDraft;

  setCharacterCreationDraft(draft: CharacterCreationDraft): void;

  getAvailableCharacterClasses(): {
    key: string;
    name: string;
    description: string;
  }[];

  createCharacterFromDraft(): Promise<void>;
}
