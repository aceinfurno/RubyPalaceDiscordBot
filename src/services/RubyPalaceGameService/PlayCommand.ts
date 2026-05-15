import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

import { ICommand } from "../../commands";
import { IGameService } from "../IGameService";

export class PlayCommand implements ICommand {
  public data = new SlashCommandBuilder()
    .setName("play")
    .setDescription("Launches the game.");

  constructor(
    private gameService: IGameService,
  ) {}

  public async execute(
    interaction: ChatInputCommandInteraction
  ): Promise<void> {
    const session = await this.gameService.launchGame(
      interaction.user.id
    );

    const payload = await this.gameService.render(session);

    await interaction.reply(payload);
  }
}
