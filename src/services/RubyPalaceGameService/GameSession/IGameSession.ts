import { IGameState, GameActionResult } from "./index";
import { CharacterInfo, PlayerCharacter } from "../character";

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

  getPlayerCharacter(): PlayerCharacter | undefined;
  setPlayerCharacter(character: PlayerCharacter): void;
  createCharacterFromDraft(): Promise<void>;
}
