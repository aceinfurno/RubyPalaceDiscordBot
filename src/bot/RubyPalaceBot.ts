import {
  Client,
  GatewayIntentBits
} from "discord.js";

import { CommandHandler, ButtonHandler } from "../handlers";
import { IBotService } from "../services/IBotService";

export class RubyPalaceBot {

  private client: Client;

  constructor(
    private commandHandler: CommandHandler,
    private buttonHandler: ButtonHandler
  ) {

    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
      ],
    });
  }
  public loadServices(services: IBotService[]): void {
    for (const service of services) {
      this.buttonHandler.loadService(service);
      this.commandHandler.loadCommands(service.getCommands());
    }
  }
  public start(token: string): void {

    this.registerEvents();

    this.client.login(token);
  }

  private registerEvents(): void {

    this.client.once("clientReady", () => {
      console.log(`Logged in as ${this.client.user?.tag}`);
    });

    this.client.on(
      "interactionCreate",
      async (interaction) => {

        if (interaction.isChatInputCommand()) {
          await this.commandHandler
            .handleInteraction(interaction);

          return;
        }

        if (interaction.isButton()) {
          await this.buttonHandler
            .handle(interaction);

          return;
        }

      }
    );
  }
}
