import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  MessageCreateOptions,
  InteractionUpdateOptions,
} from "discord.js";

import { IGameSession, GameView, GameControl } from "../GameSession/index";

export class DiscordGameRenderer {
  constructor(
    private readonly serviceKeyword: string
  ) {}

  public async render(
    session: IGameSession
  ): Promise<InteractionUpdateOptions> {

    const state = session.getState();

    const view = state.getView(session);

    const content =
`# ${view.title}

${view.description}`;

    const rows = this.buildControls(view.controls);

    return {
      content,
      components: rows,
    };
  }

  private buildControls(
    controls: GameControl[]
  ): ActionRowBuilder<ButtonBuilder>[] {

    const buttons = controls.filter(
      control => control.type === "button"
    );

    if (buttons.length === 0) {
      return [];
    }

    const buttonComponents = buttons.map(control =>
      this.createButton(control)
    );

    const row =
      new ActionRowBuilder<ButtonBuilder>()
        .addComponents(buttonComponents);

    return [row];
  }

  private createButton(control: GameControl): ButtonBuilder {

    if (control.type !== "button") {
      throw new Error(
        `Unsupported control type: ${control.type}`
      );
    }

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
