import { IGameState, IGameSession, GameView, GameActionResult, MainMenuState } from "./index";
import * as Player from "../character";


export class CharacterCreationState implements IGameState {
  public readonly id = "character_creation";

  public getView(session: IGameSession): GameView {
    const draft = session.getCharacterInfo();

    if (!draft.characterName) {
      return {
        title: "Character Creation",
        description:
          "Welcome to Ruby Palace!\n\nFirst, choose a name for your character.",
        controls: [
          {
            type: "modal",
            action: "set_character_name",
            buttonLabel: "Set Name",
            title: "Character Name",
            fields: [
              {
                id: "name",
                label: "Enter your character name",
                placeholder: "Enter name...",
                required: true,
                minLength: 2,
                maxLength: 24,
              },
            ],
          },
        ],
      };
    }

    if (!draft.classId) {
      const availableClasses = Player.CharacterClassRegistry.getAvailableClasses();

      return {
        title: "Character Creation",
        description:
          `Name: **${draft.characterName}**\n\n` +
          "Now choose your character class.",
        controls: [
          {
            type: "select",
            action: "choose_character_class",
            placeholder: "Choose a class",
            options: availableClasses.map(characterClass => ({
              label: characterClass.getName(),
              value: characterClass.getId(),
              description: characterClass.getDescription(),
            })),
          },
          {
            type: "button",
            action: "restart_character_creation",
            label: "Start Over",
            style: "danger",
          },
        ],
      };
    }

    const selectedClass = Player.CharacterClassRegistry.create(draft.classId);

    return {
      title: "Confirm Character",
      description:
        `Name: **${draft.characterName}**\n` +
        `Class: **${selectedClass?.getName() ?? draft.classId}**\n\n` +
        "Create this character?",
      controls: [
        {
          type: "button",
          action: "confirm_character_creation",
          label: "Create Character",
          style: "success",
        },
        {
          type: "button",
          action: "restart_character_creation",
          label: "Start Over",
          style: "danger",
        },
      ],
    };
  }

  public async handleAction(
  action: string,
  session: IGameSession
): Promise<GameActionResult> {
  const draft = session.getCharacterInfo();

  if (action === "set_character_name") {
    return {
      type: "modal",
      modal: {
        action: "set_character_name",
        title: "Character Name",
        fields: [
          {
            id: "name",
            label: "Enter your character name",
            placeholder: "Enter Name...",
            required: true,
            minLength: 2,
            maxLength: 24,
          },
        ],
      },
    };
  }

  if (action.startsWith("set_character_name:")) {
    const characterName = action
      .slice("set_character_name:".length)
      .trim();

    if (!characterName) {
      return { type: "render" };
    }

    session.setCharacterInfo({
      ...draft,
      characterName,
    });

    return { type: "render" };
  }

  if (action.startsWith("choose_character_class:")) {
  const classId = action.slice(
    "choose_character_class:".length
  ) as Player.CharacterClassId;

  session.setCharacterInfo({
    ...draft,
    classId,
  });

  return { type: "render" };
}

  if (action === "restart_character_creation") {
    session.setCharacterInfo({});
    return { type: "render" };
  }

  if (action === "confirm_character_creation") {
    await session.createCharacterFromDraft();
    session.setState(new MainMenuState());
    return { type: "render" };
  }

  throw new Error(`Invalid action '${action}' for CharacterCreationState`);
}
}
