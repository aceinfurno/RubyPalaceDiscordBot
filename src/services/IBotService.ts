import { InteractionUpdateOptions } from "discord.js";
import { ICommand } from "../commands";
export interface IBotService {
  readonly keyword: string;

  handleAction(
    userId: string,
    action: string
  ): Promise<InteractionUpdateOptions>;
  getCommands(): Map<string, ICommand>;
}
