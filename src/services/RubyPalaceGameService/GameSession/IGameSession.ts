import { IGameState } from "./IGameState";

export interface IGameSession {
  readonly userId: string;
  readonly createdAt: Date;
  lastActiveAt: Date;

  touch(): void;

  getState(): IGameState;

  setState(state: IGameState): void;

  handleAction(action: string): Promise<void>;
}
