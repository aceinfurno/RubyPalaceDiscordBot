import { ButtonInteraction } from "discord.js";
import { RubyPalaceGameService } from "../RubyPalaceGameService";
import { DiscordGameRenderer } from "../renderer/DiscordGameRenderer";

export class GameButtonHandler {
  constructor(
    private gameService: RubyPalaceGameService,
    private renderer: DiscordGameRenderer
  ) {}

  public async handle(interaction: ButtonInteraction): Promise<void> {
    const [system, userId, action] = interaction.customId.split(":");

    if (system !== "game") return;

    if (interaction.user.id !== userId) {
      await interaction.reply({
        content: "This is not your game session.",
        ephemeral: true,
      });
      return;
    }


    const session = this.gameService.handleAction(userId, action);
    const payload = this.renderer.render(session);

    await interaction.update(payload);
  }
}
