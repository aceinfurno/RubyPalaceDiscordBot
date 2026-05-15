import {IService } from "./IBotService";

export interface IGameService extends IBotService {
  launchGame(userId: string): Promise<GameSession>;
  getSession(userId: string): GameSession | undefined;
  render(session: IGameSession): Promise<InteractionUpdateOptions>
}
