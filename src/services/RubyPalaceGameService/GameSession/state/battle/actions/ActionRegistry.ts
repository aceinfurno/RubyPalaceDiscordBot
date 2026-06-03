import { IBattleAction } from "./IBattleAction";
import { BasicAttackAction } from "./BasicAttackAction";
import { PowerStrikeAction } from "./PowerStrikeAction";
import { UseItemBattleAction } from "./UseItem";
export type ActionId =
  | "basic_attack"
  | "power_strike"
  | "use_item"


export class ActionRegistry {
  private static readonly actions: Partial<Record<ActionId, () => IBattleAction>> = {
    basic_attack: () => new BasicAttackAction(),
    power_strike: () => new PowerStrikeAction(),
  };
  public static validateAction(action: string): ActionId {
    if (!(action in this.actions)) {
      throw new Error("Not a valid action")
    }
    return action as ActionId;
  }
  public static createAction(actionId: ActionId): IBattleAction {
    const actionFactory = this.actions[actionId];

    if (!actionFactory) {
      throw new Error(`Unknown action id: ${actionId}`);
    }

    return actionFactory();
  }
}
