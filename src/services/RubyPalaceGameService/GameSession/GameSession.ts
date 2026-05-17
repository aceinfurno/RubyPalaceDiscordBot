import { IGameState, IGameSession, CharacterCreationDraft, GameActionResult } from "./index";

export class GameSession implements IGameSession {
  public readonly userId: string;
  public readonly createdAt: Date;
  public lastActiveAt: Date;
  private state: IGameState;
  private characterDraft: CharacterCreationDraft = {};

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
  public async handleAction(action: string): Promise<GameActionResult> {
    return await this.state.handleAction(action, this);
}
  static createNew(userId: string, startingState: IGameState): GameSession {
    return new GameSession(userId, startingState);
  }

  static fromSave(userId: string, data: unknown, startingState: IGameState): GameSession {
    const session = new GameSession(userId, startingState);

    // Later: restore player stats, inventory, location, etc. from data.

    return session;
  }
  public getCharacterCreationDraft(): CharacterCreationDraft {
    return this.characterDraft;
  };

  public setCharacterCreationDraft(draft: CharacterCreationDraft): void{
    this.characterDraft = draft;
  }

  public getAvailableCharacterClasses(): {
  key: string;
  name: string;
  description: string;
}[] {
  return [{key: "Rogue", name: "Rogue1", description: "Stabby"}];
}

public async createCharacterFromDraft(): Promise<void> {
console.log("Creating character from draft:", this.characterDraft);
}

}
