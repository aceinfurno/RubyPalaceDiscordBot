import {
  Interaction,
  ButtonInteraction,
  StringSelectMenuInteraction,
  ModalSubmitInteraction,
} from "discord.js";

import { IBotService } from "../services/IBotService";
import { DiscordPayload } from "../services/RubyPalaceGameService/renderer";

type HandledInteraction =
  | ButtonInteraction
  | StringSelectMenuInteraction
  | ModalSubmitInteraction;

export class InteractionHandler {
  private services = new Map<string, IBotService>();

  public loadService(service: IBotService): void {
    this.services.set(service.keyword, service);
  }

  public async handle(interaction: Interaction): Promise<void> {
    if (interaction.isButton() || interaction.isStringSelectMenu()) {
      await this.handleComponentInteraction(interaction);
      return;
    }

    if (interaction.isModalSubmit()) {
      await this.handleModalSubmit(interaction);
      return;
    }
  }

  private async handleComponentInteraction(
    interaction: ButtonInteraction | StringSelectMenuInteraction
  ): Promise<void> {
    const [keyword, ...actionParts] = interaction.customId.split(":");
    const action = actionParts.join(":");

    const service = this.services.get(keyword);

    if (!service) {
      await interaction.reply({
        content: "Unknown interaction.",
        ephemeral: true,
      });
      return;
    }

    try {
      let finalAction = action;

      if (interaction.isStringSelectMenu()) {
        finalAction = `${action}:${interaction.values[0]}`;
      }

      const result = await service.handleAction(
        interaction.user.id,
        finalAction
      );

      await this.respond(interaction, result);
    } catch (error) {
      console.error(error);
      await this.replyWithError(interaction);
    }
  }

  private async handleModalSubmit(
    interaction: ModalSubmitInteraction
  ): Promise<void> {
    const [keyword, ...actionParts] = interaction.customId.split(":");
    const action = actionParts.join(":");

    const service = this.services.get(keyword);

    if (!service) {
      await interaction.reply({
        content: "Unknown modal interaction.",
        ephemeral: true,
      });
      return;
    }

    try {
      const fieldValue = interaction.fields.getTextInputValue("name");

      const finalAction = `${action}:${fieldValue}`;

      const result = await service.handleAction(
        interaction.user.id,
        finalAction
      );

      await this.respond(interaction, result);
    } catch (error) {
      console.error(error);
      await this.replyWithError(interaction);
    }
  }

  private async respond(
  interaction: HandledInteraction,
  result: DiscordPayload<unknown>
): Promise<void> {
  switch (result.type) {
    case "update":
      if (interaction.isButton() || interaction.isStringSelectMenu()) {
        await interaction.update(result.payload as any);
        return;
      }

      if (interaction.isModalSubmit()) {
        await interaction.reply(result.payload as any);
        return;
      }

      return;

    case "modal":
      if (!interaction.isButton()) {
        await interaction.reply({
          content: "That action cannot open a modal here.",
          ephemeral: true,
        });
        return;
      }

      await interaction.showModal(result.payload as any);
      return;
  }
}

  private async replyWithError(
    interaction: HandledInteraction
  ): Promise<void> {
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while handling that interaction.",
        ephemeral: true,
      });
      return;
    }

    await interaction.reply({
      content: "There was an error while handling that interaction.",
      ephemeral: true,
    });
  }
}
