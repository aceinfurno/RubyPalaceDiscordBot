// gameSession/state/states/BattleState.ts

import { IGameState, GameActionResult } from "../IGameState";
import { IGameSession } from "../../IGameSession";
import { GameView } from "../rendering";
import { BattleManager } from "../battle";
import { IEnemyCharacter } from "../../../character";

export class BattleState implements IGameState {
  public readonly id = "battle";

  private battleManager: BattleManager;

  private enemies: IEnemyCharacter[];

  constructor(
    enemies: IEnemyCharacter[],
    session: IGameSession
  ) {
    const player = session.getPlayerCharacter();

    if (!player) {
      throw new Error(
        "Cannot start battle without an active player character."
      );
    }

    this.enemies = enemies;

    this.battleManager = new BattleManager(
      enemies,
      player
    );
  }

  public getView(session: IGameSession): GameView {
  return {
    title: "Battle",
    description:
      `## Enemies\n${this.formatEnemyCombatInfo()}\n\n` +
      `## Player\n${this.formatPlayerCombatInfo(session)}\n\n`,
    controls: [
      {
        type: "button",
        action: "battle_basic_attack",
        label: "Attack",
        style: "primary",
      },
      {
        type: "button",
        action: "battle_skills",
        label: "Skills",
        style: "secondary",
      },
      {
        type: "button",
        action: "battle_abilities",
        label: "Abilities",
        style: "secondary",
      },
      {
        type: "button",
        action: "battle_items",
        label: "Items",
        style: "secondary",
      },
      {
        type: "button",
        action: "battle_flee",
        label: "Flee",
        style: "danger",
      },
    ],
  };
}
  private formatPlayerCombatInfo(session: IGameSession): string {
  const player = session.getPlayerCharacter();

  if (!player) {
    throw new Error("BattleState requires a player character.");
  }

  return (
    `**${player.getCharacterName()}**\n` +
    `❤️ HP: ${player.getCurrentHP()}/${player.getMaxHP()}\n` +
    `🔷 MP: ${player.getCurrentMP()}/${player.getMaxMP()}\n` +
    `⚡ SP: ${player.getCurrentSP()}/${player.getMaxSP()}`
  );
}

private formatEnemyCombatInfo(): string {
  return this.enemies
    .map((enemy, index) => {
      return (
        `**${index + 1}. ${enemy.getCharacterName()}**\n` +
        `❤️ HP: ${enemy.getCurrentHP()}/${enemy.getMaxHP()}\n` +
        `🔷 MP: ${enemy.getCurrentMP()}/${enemy.getMaxMP()}\n` +
        `⚡ SP: ${enemy.getCurrentSP()}/${enemy.getMaxSP()}`
      );
    })
    .join("\n\n");
}
  public async handleAction(
    action: string,
    session: IGameSession
  ): Promise<GameActionResult> {
    if (action === "battle_basic_attack") {
      return { type: "render" };
    }

    if (action === "battle_skills") {
      return { type: "render" };
    }

    if (action === "battle_abilities") {
      return { type: "render" };
    }

    if (action === "battle_items") {
      return { type: "render" };
    }

    if (action === "battle_flee") {
      return { type: "render" };
    }

    throw new Error(`Invalid action '${action}' for BattleState`);
  }
}
