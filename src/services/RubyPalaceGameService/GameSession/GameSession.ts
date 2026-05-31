import { IGameState, IGameSession, GameActionResult } from "./index";
import { PlayerCharacter, IPlayerCharacter, CharacterInfo} from "../character";

export class GameSession implements IGameSession {
  public readonly userId: string;
  public readonly createdAt: Date;
  public lastActiveAt: Date;
  private stateStack: IGameState[] = [];
  private characterInfo: Partial<CharacterInfo> = {};
  private activeCharacter: IPlayerCharacter | undefined;

  constructor(userId: string, startingState: IGameState ) {
    this.userId = userId;
    this.createdAt = new Date();
    this.lastActiveAt = new Date();
    this.stateStack.push(startingState);
  }

  public touch(): void {
    this.lastActiveAt = new Date();
  }
  public getCurrentState(): IGameState {
    const state = this.stateStack[this.stateStack.length - 1];

    if (!state) {
      throw new Error("No active game state.");
    }

    return state;
  }
  public pushState(state: IGameState): void {
    this.stateStack.push(state);
  }
  public popState(): void {
    if (this.stateStack.length <= 1) {
      throw new Error("Cannot pop the final state.");
    }
    this.stateStack.pop();
  }
  public setState(state: IGameState): void {
    this.stateStack = [state];
  }
  public async handleAction(action: string): Promise<GameActionResult> {
    const currentState = this.getCurrentState();
    return await currentState.handleAction(action, this);
}
  static createNew(userId: string, startingState: IGameState): GameSession {
    return new GameSession(userId, startingState);
  }

  static fromSave(userId: string, data: unknown, startingState: IGameState): GameSession {
    const session = new GameSession(userId, startingState);

    // Later: restore player stats, inventory, location, etc. from data.

    return session;
  }
  public getCharacterInfo(): Partial<CharacterInfo> {
    return this.characterInfo;
  };

  public setCharacterInfo(draft: Partial<CharacterInfo>): void{
    this.characterInfo = draft;
  }
  public getPlayerCharacter(): IPlayerCharacter | undefined{
    return this.activeCharacter
  }
  public setPlayerCharacter(character: IPlayerCharacter){
    this.activeCharacter = character;
  }

  public async createCharacterFromDraft(): Promise<void> {
    if (
      !this.characterInfo.characterName ||
      !this.characterInfo.classId
    ) {
      throw new Error("Character creation draft is incomplete.");
    }

    const characterInfo: CharacterInfo = {
      id: crypto.randomUUID(),
      userId: this.userId,

      characterName: this.characterInfo.characterName,
      classId: this.characterInfo.classId,
    };

    this.activeCharacter =
      PlayerCharacter.create(characterInfo);
  }

}
