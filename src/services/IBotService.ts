import { InteractionUpdateOptions } from "discord.js";
import { ICommand } from "../commands";
import { DiscordPayload } from "./GameSession"
export interface IBotService {
  readonly keyword: string;

  handleAction(
    userId: string,
    action: string
  ): Promise<DiscordPayload>;
  getCommands(): Map<string, ICommand>;
}
