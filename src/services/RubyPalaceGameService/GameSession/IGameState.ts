import { IGameSession, GameView } from "./index";

export interface IGameState {
  readonly id: string;

  getView(session: IGameSession): GameView;

  handleAction(
    action: string,
    session: IGameSession
  ): Promise<void>;
}
