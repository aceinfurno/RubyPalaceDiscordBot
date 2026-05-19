import {
  IGameState,
  IGameSession,
  GameView,
  GameActionResult,
} from "./index";

export class MainMenuState implements IGameState {
  public readonly id = "main_menu";

  public getView(session: IGameSession): GameView {
    const character = session.getPlayerCharacter();
    if (!character) {
      throw new Error("MainMenuState requires an active character.");
    }
    return {
      title: "Ruby Palace",
      description:
        `**${character.getCharacterName()}** • ` +
        `Level ${character.getLevel()} ` +
        `${character.getPlayerClass().getName()}\n\n` +

        `HP: ${character.getCurrentHP()} / ${character.getMaxHP()}\n` +
        `MP: ${character.getCurrentMP()} / ${character.getMaxMP()}\n` +
        `SP: ${character.getCurrentSP()} / ${character.getMaxSP()}\n\n` +

        `Gold: ${character.getGold()}\n\n` +

        "What would you like to do?",

      controls: [
        {
          type: "button",
          action: "go_explore",
          label: "Explore",
          style: "primary",
        },
        {
          type: "button",
          action: "go_test_battle",
          label: "Test Battle",
          style: "danger",
        },
        {
          type: "button",
          action: "go_inventory",
          label: "Inventory",
          style: "secondary",
        },
        {
          type: "button",
          action: "go_shop",
          label: "Shop",
          style: "secondary",
        },
      ],
    };
  }

  public async handleAction(
    action: string,
    session: IGameSession
  ): Promise<GameActionResult> {
    if (action === "go_explore") {
      //session.setState("explore");
      return { type: "render" };
    }

    if (action === "go_test_battle") {
      //session.setState("test_battle");
      return { type: "render" };
    }

    if (action === "go_inventory") {
      //session.setState("inventory");
      return { type: "render" };
    }

    if (action === "go_shop") {
      //session.setState("shop");
      return { type: "render" };
    }

    throw new Error(`Invalid action '${action}' for MainMenuState`);
  }
}
