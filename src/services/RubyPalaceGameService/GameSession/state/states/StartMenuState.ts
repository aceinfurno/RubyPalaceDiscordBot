import { IGameState, GameActionResult } from "../IGameState";
import { IGameSession } from "../../IGameSession";
import { GameView } from "../rendering";
import { StateRegistry } from "./stateRegistry";

export class StartMenuState implements IGameState {
  public readonly id = "start_menu";

  public getView(session: IGameSession): GameView {
    return {
      title: "Ruby Palace",
      description: "Welcome to Ruby Palace. What would you like to do?",
      controls: [
        {
          type: "button",
          action: "new_character",
          label: "New Character",
          style: "primary",
        },
        {
          type: "button",
          action: "load_character",
          label: "Load Character",
          style: "secondary",
        },
      ],
    };
  }

  public async handleAction(
    action: string,
    session: IGameSession
  ): Promise<GameActionResult> {

    switch (action) {

      case "new_character":
        session.setState(StateRegistry.create("character_creation"));

        return {
          type: "render",
        };

      case "load_character":
        // Placeholder until saves/character list is ready.

        return {
          type: "render",
        };

      default:
        throw new Error(
          `Invalid action '${action}' for StartMenuState`
        );
    }
  }
}
