import * as dotenv from "dotenv";
import { REST, Routes } from "discord.js";
import { PingCommand } from "./commands/PingCommand";
import { PlayCommand } from "./commands/PlayCommand";
import { RubyPalaceGameService } from "./services/RubyPalaceGameService/RubyPalaceGameService";
import { DiscordGameRenderer } from "./services/RubyPalaceGameService/renderer/DiscordGameRenderer";

dotenv.config();

const rubyPalaceGame = new RubyPalaceGameService();
const gameRenderer = new DiscordGameRenderer();
const commands = [
  new PingCommand().data.toJSON(), new PlayCommand(rubyPalaceGame, gameRenderer).data.toJSON(),
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN!);

async function deployCommands() {
  try {
    console.log("Registering slash commands...");

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID!,
        process.env.GUILD_ID1!,
      ),

      { body: commands }
    );
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID!,
        process.env.GUILD_ID2!,
      ),

      { body: commands }
    );

    console.log("Slash commands registered.");
  } catch (error) {
    console.error(error);
  }
}

deployCommands();
