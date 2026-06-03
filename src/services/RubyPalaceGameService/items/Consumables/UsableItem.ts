import { Item } from "../Item";
import { BattleContext, BattleActionTargetType, BattleActionResult } from "../../GameSession";
import { ICharacter } from "../../character";

export abstract class UsableItem extends Item {
  protected isConsumable: boolean = true;
  public override isUsableInBattle(): boolean {
    return true;
  }

  public getTargetType(): BattleActionTargetType {
    return "self";
}
  public getMaxTargets(): number {
    return 1;
  }
  public canUse(
    context: BattleContext,
    targets: ICharacter[],
  ): boolean {
    return true;
  }
  protected abstract executeUse(actor: ICharacter, targets: ICharacter[]): BattleActionResult
  private consumeItem(actor: ICharacter) {
    actor.getInventory().removeItem(this.getId());
  }
  public use(
    actor: ICharacter,
    targets: ICharacter[]
  ): BattleActionResult {
    const response = this.executeUse(actor, targets);
    if (this.isConsumable) {
      this.consumeItem(actor);
    }
    return response;
  }
}
