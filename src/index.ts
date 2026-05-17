import * as dotenv from "dotenv";

import { RubyPalaceBot } from "./bot/RubyPalaceBot";

import { CommandHandler, InteractionHandler } from "./handlers/index";

import { RubyPalaceGameService} from "./services/RubyPalaceGameService/RubyPalaceGameService";

import { IBotService } from "./services/IBotService";


dotenv.config();

const RubyPalaceGame = new RubyPalaceGameService();

const commandHandler = new CommandHandler();

const interactionHandler = new InteractionHandler();
const services: IBotService[] = [RubyPalaceGame];
const bot = new RubyPalaceBot(commandHandler, interactionHandler);
bot.loadServices(services);
bot.start(process.env.TOKEN!);
