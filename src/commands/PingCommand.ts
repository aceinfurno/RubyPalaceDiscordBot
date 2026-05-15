import {
  ChatInputCommandInteraction,
  SlashCommandBuilder
} from "discord.js";

import { ICommand } from "./ICommand";

export class PingCommand implements ICommand {

  public data = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!");

  public async execute(
    interaction: ChatInputCommandInteraction
  ): Promise<void> {

    await interaction.reply("Pong!");
  }
}
