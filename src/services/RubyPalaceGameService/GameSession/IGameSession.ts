import { IGameState, GameActionResult } from "./index";
import { CharacterInfo, IPlayerCharacter } from "../character";

export interface IGameSession {
  readonly userId: string;
  readonly createdAt: Date;
  lastActiveAt: Date;

  touch(): void;

  getState(): IGameState;

  setState(state: IGameState): void;

  handleAction(action: string): Promise<GameActionResult>;
  getCharacterInfo(): Partial<CharacterInfo>;

  setCharacterInfo(draft: Partial<CharacterInfo>): void;

  getPlayerCharacter(): IPlayerCharacter | undefined;
  setPlayerCharacter(character: IPlayerCharacter): void;
  createCharacterFromDraft(): Promise<void>;
}
