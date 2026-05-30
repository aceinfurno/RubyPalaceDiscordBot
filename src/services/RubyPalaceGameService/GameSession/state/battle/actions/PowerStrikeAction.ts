import { BattleAction } from "./BattleAction";
export class PowerStrikeAction extends BattleAction {
  public constructor() {
    super({
      id: "power_strike",
      name: "Power Strike",
      description: "Spend SP to strike with extra force.",
      targetType: "enemy",
      resourceCost: {
        sp: 3,
      },
      damage: {
        type: "physical",
        scalingStat: "strength",
        power: 1.75,
        flatBonus: 2,
        defenseStat: "constitution",
      },
      keywords: ["melee", "physical", "can_crit"],
    });
  }
}
