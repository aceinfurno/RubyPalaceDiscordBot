// gameSession/state/states/BattleState.tsf

import { IGameState, GameActionResult } from "../IGameState";
import { IGameSession } from "../../IGameSession";
import { GameView, GameControl } from "../rendering";
import { BattleManager, BattlePhase, ActionRegistry, BattleActionTargetType } from "../battle";
import { IEnemyCharacter } from "../../../character";
import { StateRegistry, GameStateId } from "./stateRegistry";
type BattleScreen =
  | "action_select"
  | "skill_select"
  | "item_select";

export class BattleState implements IGameState {
  public readonly id = "battle";

  private battleManager: BattleManager;
  private battleScreen: BattleScreen;


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
    this.battleScreen = "action_select";
  }

  public getView(session: IGameSession): GameView {
    const gameView: GameView = {
      title: "Battle",
      description: "",
      controls: [],
    }
    const battlePhase = this.battleManager.getBattlePhase();
    if (battlePhase !== "battle_over"){
    gameView.description += this.formatBattleLog() + '\n\n' + this.mainDisplay(session);

    switch (battlePhase ) {
      case "action_select":
        switch (this.battleScreen) {
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

        }
        break;

      case "target_select":
        gameView.description += `Choose a target.\n\n`;
        gameView.controls = this.getTargetControls();
        break;
      }
    }
    else {
      if (this.battleManager.playerWon()) {
        return this.getVictoryView(session);
      }
      return this.getDefeatView(session);
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
  private getVictoryView(session: IGameSession): GameView {
    return {
      title: "Victory!",
      description: "\n\n" + this.formatRewards(session) + "\n\n",
      controls: [
        {
          type: "button",
          action: "battle_victory_continue",
          label: "Continue",
          style: "primary",
        },
      ],
    };
  }
  private formatRewards(session: IGameSession): string{
    return "FIXME!!! BattleState.formatRewards()"
  }

  private getDefeatView(session: IGameSession): GameView {
    return {
      title: "Defeat...",
      description: this.formatBattleLog() + "\n\n" + "You were defeated.",
      controls: [
        {
          type: "button",
          action: "battle_defeat_continue",
          label: "Continue",
          style: "primary",
        },
      ],
    };
  }
  public async handleAction(
    action: string,
    session: IGameSession
  ): Promise<GameActionResult> {
    if (action === "battle_basic_attack") {
       this.battleManager.selectAction("basic_attack");
       this.battleManager.continuePlayerTurn();
      return { type: "render" };
    }
    if (action.startsWith("battle_select_action:")) {
      const actionId = ActionRegistry.validateAction(action.replace("battle_select_action:", ""));
      console.log(actionId);
      this.battleManager.selectAction(actionId);
      this.battleManager.continuePlayerTurn();

      return { type: "render" };
    }
    if (action === "battle_skills") {
      this.battleScreen = "skill_select";
      return { type: "render" };
    }

    if (action === "battle_items") {
      this.battleScreen = "item_select";
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
      this.battleManager.continuePlayerTurn();
      this.battleScreen = "action_select";
      return { type: "render" };
    }

    if (action === "battle_back_to_skills") {
      this.battleManager.cancelTargetSelection();
      this.battleScreen = "skill_select";

      return { type: "render" };
    }
    if (action === "battle_back") {
      this.battleScreen = "action_select";

      return { type: "render" };
    }
    if (action === "battle_victory_continue") {
      session.popState();

      return { type: "render" };
    }

    if (action === "battle_defeat_continue") {
      session.setState(StateRegistry.create("main_menu"));
      return { type: "render" };
    }

    throw new Error(`Invalid action '${action}' for BattleState`);
  }
}
