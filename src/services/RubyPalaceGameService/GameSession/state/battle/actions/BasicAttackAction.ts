import { BattleAction } from "./BattleAction";
export class BasicAttackAction extends BattleAction {
  public constructor() {
    super({
      id: "basic_attack",
      name: "Attack",
      description: "Strike an enemy with a basic attack.",
      targetType: "enemy",
      damage: {
        type: "physical",
        scalingStat: "strength",
        power: 1,
        defenseStat: "constitution",
      },
      keywords: ["melee", "physical", "can_crit"],
    });
  }
}
