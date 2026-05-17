import { InteractionUpdateOptions } from "discord.js";
import { IGameService } from "../IGameService";
import { PlayerSaveRepository} from "./player/PlayerSaveRepository";
import { GameSession, StartMenuState, IGameSession } from "./GameSession";
import { DiscordGameRenderer, DiscordPayload } from "./renderer";
import { PlayCommand } from "./PlayCommand";
import { ICommand } from "../../commands/ICommand";

export class RubyPalaceGameService implements IGameService {
  public readonly keyword = "rp"

  private startingState = StartMenuState;

  private activeSessions: Map<string, GameSession> = new Map();

  private playerRepository: PlayerSaveRepository = new PlayerSaveRepository();

  private renderer = new DiscordGameRenderer(this.keyword);

  private commands = new Map<string, ICommand>();

  constructor(){
    this.loadCommands();
  }
  private loadCommands(): void{
    const playCommand = new PlayCommand(this);
    this.commands.set(playCommand.data.name, playCommand);
  }
  public getCommands(): Map<string, ICommand> {
    return this.commands;
  }
  async launchGame(userId: string): Promise<GameSession> {
  const activeSession = this.activeSessions.get(userId);

  // Resume Active Session
  if (activeSession) {
    activeSession.touch();
    return activeSession;
  }

  // Load Saved Player Data
  const savedPlayer = await this.playerRepository.findByUserId(userId);

  // Create Session
  const startingState = new this.startingState();
  const session = savedPlayer
    ? GameSession.fromSave(userId, savedPlayer, startingState)
    : GameSession.createNew(userId, startingState);

  this.activeSessions.set(userId, session);
  return session;
}
  public getSession(userId: string): IGameSession | undefined {
    return this.activeSessions.get(userId);
  }

  public async render(session: IGameSession): Promise<DiscordPayload<unknown>>{
    const payload = await this.renderer.render(session);
    return payload;
  }
  public async handleAction(
  userId: string,
  action: string
): Promise<DiscordPayload<unknown>> {
  const session = this.getSession(userId);

  if (!session) {
    throw new Error("No active game session found.");
  }

  const result = await session.handleAction(action);

  session.touch();

  if (result.type === "modal") {
    return this.renderer.renderModal(result.modal);
  }

  return this.renderer.render(session);
}

}
