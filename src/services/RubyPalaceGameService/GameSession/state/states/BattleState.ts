// gameSession/state/states/BattleState.tsf

import { IGameState, GameActionResult } from "../IGameState";
import { IGameSession } from "../../IGameSession";
import { GameView, GameControl } from "../rendering";
import { BattleManager, BattlePhase, ActionRegistry, BattleActionTargetType } from "../battle";
import { IEnemyCharacter } from "../../../character";

export class BattleState implements IGameState {
  public readonly id = "battle";

  private battleManager: BattleManager;


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


    this.battleManager = new BattleManager(
      enemies,
      player
    );
  }

  public getView(session: IGameSession): GameView {
    const gameView: GameView = {
      title: "Battle",
      description: "",
      controls: [],
    }
    gameView.description += this.formatBattleLog() + this.mainDisplay(session);
    const battlePhase = this.battleManager.getBattlePhase();
    switch (this.battleManager.getBattlePhase() ) {
      case "action_select":
        gameView.controls = this.getPlayerControls();
        break;

      case "skill_select":
        gameView.description += `Choose a skill.\n\n`;
        gameView.controls = this.getSkillControls(session);
        break;

      //case "item_select":
        //gameView.description += `Choose an item.\n\n`;
        //gameView.controls = this.getItemControls();
        //break;

      case "target_select":
        gameView.description += `Choose a target.\n\n`;
        gameView.controls = this.getTargetControls();
        break;
      }
    return gameView;
}
  private mainDisplay(session: IGameSession): string{
    return `## Enemies\n${this.formatEnemyCombatInfo()}\n\n` +
    `## Player\n${this.formatPlayerCombatInfo(session)}\n\n`;
  }
  private getPlayerControls(): GameControl[] {
    return [
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
    ]
  }
  private getTargetControls(): GameControl[] {
  const selectedAction =
    this.battleManager.getSelectedAction();

  const selectedTargetIds =
    this.battleManager.getSelectedTargets();

  const validTargets =
    this.battleManager.getValidTargetsForSelectedAction();

  const controls: GameControl[] =
    validTargets.map((target) => {

      const isSelected =
        selectedTargetIds.includes(target.getId());

      return {
        type: "button",
        action:
          `battle_toggle_target:${target.getId()}`,
        label: isSelected
          ? `✓ ${target.getCharacterName()}`
          : target.getCharacterName(),
        style: isSelected
          ? "primary"
          : "secondary",
      };
    });

  controls.push({
    type: "button",
    action: "battle_back_to_skills",
    label: "Back",
    style: "danger",
  });

  controls.push({
    type: "button",
    action: "battle_confirm_targets",
    label: "Confirm",
    style: "success",
  });

  return controls;
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
  const enemies = this.battleManager.getEnemies();
  console.log(
    "BattleState enemies:",
    enemies.map(enemy => enemy.getCharacterName())
  );
  return enemies
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
  private formatBattleLog(): string {
    const log = this.battleManager.getBattleLog();

    if (log.length === 0) {
      return "";
    }

    return (
      "\n\n**Battle Log**\n" +
      log.map(message => `• ${message}`).join("\n")
    );
  }
private getSkillControls(session: IGameSession): GameControl[] {
  const player = session.getPlayerCharacter();

  if (!player) {
    throw new Error("Cannot get skills without a player character.");
  }

  const skillIds = player.getSkillIds();

  const controls: GameControl[] = skillIds.map((skillId) => {
    const skill = ActionRegistry.createAction(skillId);

    return {
      type: "button",
      action: `battle_select_action:${skill.getId()}`,
      label: skill.getName(),
      style: "secondary",
    };
  });

  controls.push({
    type: "button",
    action: "battle_back",
    label: "Back",
    style: "danger",
  });

return controls;
}
  public async handleAction(
    action: string,
    session: IGameSession
  ): Promise<GameActionResult> {
    if (action === "battle_basic_attack") {
       this.battleManager.selectAction("basic_attack");
      return { type: "render" };
    }
    if (action.startsWith("battle_select_action:")) {
      const actionId = ActionRegistry.validateAction(action.replace("battle_select_action:", ""));
      console.log(actionId);
      this.battleManager.selectAction(actionId);

      return { type: "render" };
    }
    if (action === "battle_skills") {
      this.battleManager.setBattlePhase("skill_select");
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
    if (action.startsWith("battle_toggle_target:")) {
      const targetId = action.replace("battle_toggle_target:", "");

      this.battleManager.toggleTarget(targetId);

      return { type: "render" };
    }

    if (action === "battle_confirm_targets") {
      this.battleManager.confirmSelectedTargets();

      return { type: "render" };
    }

    if (action === "battle_back_to_skills") {
      this.battleManager.cancelTargetSelection();

      return { type: "render" };
    }

    throw new Error(`Invalid action '${action}' for BattleState`);
  }
}
