import { IGameState, IGameSession, GameActionResult } from "./index";
import { PlayerCharacter, IPlayerCharacter, CharacterInfo} from "../character";

export class GameSession implements IGameSession {
  public readonly userId: string;
  public readonly createdAt: Date;
  public lastActiveAt: Date;
  private state: IGameState;
  private characterInfo: Partial<CharacterInfo> = {};
  private activeCharacter: IPlayerCharacter | undefined;

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
