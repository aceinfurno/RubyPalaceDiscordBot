import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  InteractionUpdateOptions,
  StringSelectMenuBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

import { IGameSession, GameView, GameControl, GameModal } from "../GameSession";
import { DiscordPayload } from "./index";

export class DiscordGameRenderer {
  constructor(
    private readonly serviceKeyword: string
  ) {}
  public async renderModal(
  modalData: GameModal
): Promise<DiscordPayload<unknown>> {
  const modal = new ModalBuilder()
    .setCustomId(`${this.serviceKeyword}:${modalData.action}`)
    .setTitle(modalData.title);

  const rows = modalData.fields.map(field =>
    new ActionRowBuilder<TextInputBuilder>()
      .addComponents(
        new TextInputBuilder()
          .setCustomId(field.id)
          .setLabel(field.label)
          .setStyle(TextInputStyle.Short)
          .setPlaceholder(field.placeholder ?? "")
          .setRequired(field.required ?? true)
          .setMinLength(field.minLength ?? 1)
          .setMaxLength(field.maxLength ?? 100)
      )
  );

  modal.addComponents(rows);

  return DiscordPayload.modal(modal);
}
  public async render(
    session: IGameSession
  ): Promise<DiscordPayload<unknown>> {

    const state = session.getCurrentState();

    const view = state.getView(session);

    const content =
`# ${view.title}

${view.description}`;

    const rows = this.buildControls(view.controls);

    return DiscordPayload.update({
  content,
  components: rows,
});
  }

  private buildControls(
  controls: GameControl[]
): ActionRowBuilder<ButtonBuilder | StringSelectMenuBuilder>[] {
  const rows: ActionRowBuilder<ButtonBuilder | StringSelectMenuBuilder>[] = [];

  const buttons = controls.filter(
    control => control.type === "button"
  );

  const modals = controls.filter(
    control => control.type === "modal"
  );

  const buttonComponents = [
    ...buttons.map(control => this.createButton(control)),
    ...modals.map(control => this.createModalButton(control)),
  ];

  if (buttonComponents.length > 0) {
    const buttonRow =
      new ActionRowBuilder<ButtonBuilder>()
        .addComponents(buttonComponents);

    rows.push(buttonRow);
  }

  const selects = controls.filter(
    control => control.type === "select"
  );

  for (const select of selects) {
    const selectRow =
      new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(
          this.createSelect(select)
        );

    rows.push(selectRow);
  }

  return rows;
}
  private createModalButton(
    control: Extract<GameControl, { type: "modal" }>
  ): ButtonBuilder {
    return new ButtonBuilder()
    .setCustomId(
      `${this.serviceKeyword}:${control.action}`
    )
    .setLabel(control.buttonLabel)
    .setStyle(ButtonStyle.Primary);
  }
  private createSelect(control: Extract<GameControl, { type: "select" }>): StringSelectMenuBuilder {
    return new StringSelectMenuBuilder()
    .setCustomId(
      `${this.serviceKeyword}:${control.action}`
    )
    .setPlaceholder(control.placeholder)
    .addOptions(
      control.options.map(option => ({
        label: option.label,
        value: option.value,
        description: option.description,
      }))
    );
  }
  private createButton(
  control: Extract<GameControl, { type: "button" }>
): ButtonBuilder {
  return new ButtonBuilder()
    .setCustomId(
      `${this.serviceKeyword}:${control.action}`
    )
    .setLabel(control.label)
    .setStyle(
      this.mapButtonStyle(control.style)
    );
}

  private mapButtonStyle(
    style?: string
  ): ButtonStyle {

    switch (style) {

      case "primary":
        return ButtonStyle.Primary;

      case "success":
        return ButtonStyle.Success;

      case "danger":
        return ButtonStyle.Danger;

      case "secondary":
      default:
        return ButtonStyle.Secondary;
    }
  }
}
