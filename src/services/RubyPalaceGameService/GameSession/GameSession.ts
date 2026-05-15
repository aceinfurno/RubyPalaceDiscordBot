import { IGameState } from "./IGameState";
import { IGameSession } from "./IGameSession";

export class GameSession implements IGameSession {
  public readonly userId: string;
  public readonly createdAt: Date;
  public lastActiveAt: Date;
  private state: IGameState;

  constructor(userId: string, startingState: IGameState ) {
    this.userId = userId;
    this.createdAt = new Date();
    this.lastActiveAt = new Date();
    this.state = startingState;
  }

  public touch(): void {
    this.lastActiveAt = new Date();
  }
  public getState(): IGameState {
    return this.state;
  }
  public setState(state: IGameState): void {
    this.state = state;
    this.touch();
}
  public async handleAction(action: string){
    this.state.handleAction(action, this);
  }
  static createNew(userId: string, startingState: IGameState): GameSession {
    return new GameSession(userId, startingState);
  }

  static fromSave(userId: string, data: unknown, startingState: IGameState): GameSession {
    const session = new GameSession(userId, startingState);

    // Later: restore player stats, inventory, location, etc. from data.

    return session;
  }
}
