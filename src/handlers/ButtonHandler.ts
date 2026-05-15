import { ButtonInteraction } from "discord.js";
import { IBotService } from "../services/IBotService";

export class ButtonHandler {
  private services = new Map<string, IBotService>();

  public loadService(service: IBotService): void {
    this.services.set(service.keyword, service);
  }
  public async handle(interaction: ButtonInteraction): Promise<void> {
    const [keyword, ...actionParts] = interaction.customId.split(":");
    const action = actionParts.join(":");

    const service = this.services.get(keyword);

    if (!service) {
      await interaction.reply({
        content: "Unknown button interaction.",
        ephemeral: true,
      });
      return;
    }

    try {
      const payload = await service.handleAction(
        interaction.user.id,
        action
      );

      await interaction.update(payload);
    } catch (error) {
      console.error(error);

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "There was an error while handling that button.",
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: "There was an error while handling that button.",
          ephemeral: true,
        });
      }
    }
  }
}
