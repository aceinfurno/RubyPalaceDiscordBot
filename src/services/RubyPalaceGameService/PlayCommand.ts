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

    const result = await this.gameService.render(session);

    switch (result.type) {

      case "update":
        await interaction.editReply(
          result.payload as any
        );
        return;

      case "modal":
        throw new Error(
          "Slash commands cannot directly open modals."
        );
    }
  }
}
