import { ICharacter, CharacterStat } from "../../../../character";
import { IBattleAction, BattleActionResult, BattleActionTargetType, BattleActionConfig } from "./IBattleAction";
import { ActionId } from "./ActionRegistry";
export abstract class BattleAction implements IBattleAction {
  protected constructor(
    protected readonly config: BattleActionConfig
  ) {}

  public getId(): ActionId {
    return this.config.id;
  }

  public getName(): string {
    return this.config.name;
  }

  public getDescription(): string {
    return this.config.description;
  }

  public getTargetType(): BattleActionTargetType {
    return this.config.targetType;
  }
  public getMaxTargets(): number{
    return this.config.targeting?.maxTargets ?? 1;
  }

  public execute(
    user: ICharacter,
    target: ICharacter
  ): BattleActionResult {
    this.validateResources(user);

    this.spendResources(user);

    let message = `${user.getCharacterName()} uses ${this.getName()} on ${target.getCharacterName()}.`;

    if (this.config.damage) {
      const damage = this.calculateDamage(user, target);
      target.takeDamage(damage);

      message += ` ${target.getCharacterName()} takes ${damage} damage.`;
    }

    if (this.config.healing) {
      const healing = this.calculateHealing(user);
      target.heal(healing);

      message += ` ${target.getCharacterName()} recovers ${healing} HP.`;
    }

    return {
      message,
      defeated: target.getCurrentHP() <= 0,
    };
  }

  protected validateResources(user: ICharacter): void {
    const cost = this.config.resourceCost;

    if (!cost) return;

    if (cost.mp && user.getCurrentMP() < cost.mp) {
      throw new Error("Not enough MP.");
    }

    if (cost.sp && user.getCurrentSP() < cost.sp) {
      throw new Error("Not enough SP.");
    }

    if (cost.hp && user.getCurrentHP() <= cost.hp) {
      throw new Error("Not enough HP.");
    }
  }

  protected spendResources(user: ICharacter): void {
    const cost = this.config.resourceCost;

    if (!cost) return;

    if (cost.mp) user.spendMP(cost.mp);
    if (cost.sp) user.spendSP(cost.sp);
    if (cost.hp) user.takeDamage(cost.hp);
  }

  protected calculateDamage(
    user: ICharacter,
    target: ICharacter
  ): number {
    const damage = this.config.damage;

    if (!damage) return 0;

    const attackValue =
      this.getStatValue(user, damage.scalingStat) * damage.power;

    const defenseValue = damage.defenseStat
      ? Math.floor(this.getStatValue(target, damage.defenseStat) / 2)
      : 0;

    return Math.max(
      1,
      Math.floor(attackValue + (damage.flatBonus ?? 0) - defenseValue)
    );
  }

  protected calculateHealing(user: ICharacter): number {
    const healing = this.config.healing;

    if (!healing) return 0;

    return Math.max(
      1,
      Math.floor(
        this.getStatValue(user, healing.scalingStat) * healing.power +
        (healing.flatBonus ?? 0)
      )
    );
  }

  protected getStatValue(
    combatant: ICharacter,
    stat: CharacterStat
  ): number {
    switch (stat) {
      case "strength":
        return combatant.getStrength();
      case "dexterity":
        return combatant.getDexterity();
      case "constitution":
        return combatant.getConstitution();
      case "intelligence":
        return combatant.getIntelligence();
      case "wisdom":
        return combatant.getWisdom();
      case "luck":
        return combatant.getWisdom();
    }
  }
}
