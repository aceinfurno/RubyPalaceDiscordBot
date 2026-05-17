import { IGameState, IGameSession, GameView, GameActionResult } from "./index";


export type CharacterCreationDraft = {
  name?: string;
  classKey?: string;
};

export class CharacterCreationState implements IGameState {
  public readonly id = "character_creation";

  public getView(session: IGameSession): GameView {
    const draft = session.getCharacterCreationDraft();

    if (!draft.name) {
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
                placeholder: "Rixian",
                required: true,
                minLength: 2,
                maxLength: 24,
              },
            ],
          },
        ],
      };
    }

    if (!draft.classKey) {
      const availableClasses = session.getAvailableCharacterClasses();

      return {
        title: "Character Creation",
        description:
          `Name: **${draft.name}**\n\n` +
          "Now choose your character class.",
        controls: [
          {
            type: "select",
            action: "choose_character_class",
            placeholder: "Choose a class",
            options: availableClasses.map(characterClass => ({
              label: characterClass.name,
              value: characterClass.key,
              description: characterClass.description,
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

    const selectedClass = session
      .getAvailableCharacterClasses()
      .find(characterClass => characterClass.key === draft.classKey);

    return {
      title: "Confirm Character",
      description:
        `Name: **${draft.name}**\n` +
        `Class: **${selectedClass?.name ?? draft.classKey}**\n\n` +
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
  const draft = session.getCharacterCreationDraft();

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
            placeholder: "Rixian",
            required: true,
            minLength: 2,
            maxLength: 24,
          },
        ],
      },
    };
  }

  if (action.startsWith("set_character_name:")) {
    const name = action
      .slice("set_character_name:".length)
      .trim();

    if (!name) {
      return { type: "render" };
    }

    session.setCharacterCreationDraft({
      ...draft,
      name,
    });

    return { type: "render" };
  }

  if (action.startsWith("choose_character_class:")) {
    const classKey = action.slice("choose_character_class:".length);

    session.setCharacterCreationDraft({
      ...draft,
      classKey,
    });

    return { type: "render" };
  }

  if (action === "restart_character_creation") {
    session.setCharacterCreationDraft({});
    return { type: "render" };
  }

  if (action === "confirm_character_creation") {
    await session.createCharacterFromDraft();
    return { type: "render" };
  }

  throw new Error(`Invalid action '${action}' for CharacterCreationState`);
}
}
