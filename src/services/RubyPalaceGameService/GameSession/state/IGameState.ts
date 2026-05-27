import { GameView, GameModal } from "./rendering";
import { IGameSession } from "../IGameSession";

export interface IGameState {
  readonly id: string;

  getView(session: IGameSession): GameView;

  handleAction(
    action: string,
    session: IGameSession
  ): Promise<GameActionResult>;
}
export enum GameSessionState {
  StartMenu = "START_MENU",
  CharacterCreation = "CHARACTER_CREATION",
  LoadCharacter = "LOAD_CHARACTER",
  Playing = "PLAYING",
}
export type GameActionResult =
  | {
      type: "render";
    }
  | {
      type: "modal";
      modal: GameModal;
    };
