import {
  ChatInputCommandInteraction,
  Collection,
  Interaction,
} from "discord.js";

import { ICommand } from "../commands/ICommand";

export class CommandHandler {
  private commands = new Collection<string, ICommand>();


  public loadCommands(commands: Map<string, ICommand>): void {
    for (const [name, command] of commands) {
      this.commands.set(name, command);
    }
  }
  public async handleInteraction(interaction: Interaction): Promise<void> {
    if (!interaction.isChatInputCommand()) return;

    const command = this.commands.get(interaction.commandName);

    if (!command) {
      await interaction.reply({
        content: `Unknown command: ${interaction.commandName}`,
        ephemeral: true,
      });
      return;
    }

    try {
      await command.execute(interaction as ChatInputCommandInteraction);
    } catch (error) {
      console.error(error);

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "There was an error while executing this command.",
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: "There was an error while executing this command.",
          ephemeral: true,
        });
      }
    }
  }

  public getCommands(): ICommand[] {
    return Array.from(this.commands.values());
  }
}
