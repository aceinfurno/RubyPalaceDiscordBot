import { IGameState, IGameSession, GameView } from "./index";

export class CharacterCreationState implements IGameState {
  public readonly id = "character_creation";

  public getView(session: IGameSession): GameView {
    return {
      title: "Character Creation",
      description:
        "Character creation is currently under construction.",
      controls: [
        {
          type: "button",
          action: "back_to_menu",
          label: "Back",
          style: "secondary",
        },
      ],
    };
  }

  public async handleAction(
    action: string,
    session: IGameSession
  ): Promise<void> {

    switch (action) {

      case "back_to_menu":
        // Placeholder until StartMenuState is fully wired.
        return;

      default:
        throw new Error(
          `Invalid action '${action}' for CharacterCreationState`
        );
    }
  }
}
