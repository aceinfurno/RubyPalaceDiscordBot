import { IBattleAction, BattleActionResult, BattleActionTargetType } from "./IBattleAction";
import { ActionId } from "./ActionRegistry";
import { IUsableItem } from "../../../../items";
import { ICharacter } from "../../../../character";
import { BattleContext } from "../BattleManager";
export class UseItemBattleAction implements IBattleAction {
  constructor(private readonly item: IUsableItem) {}

  public getId(): ActionId {
    return "use_item";
  }

  public getName(): string {
    return this.item.getName();
  }

  public getDescription(): string {
    return this.item.getDescription();
  }

  public getTargetType(): BattleActionTargetType {
    return this.item.getTargetType();
  }

  public getMaxTargets(): number {
    return this.item.getMaxTargets();
  }
  public canUse(context: BattleContext, targets: string[]): boolean {
    return true;
  }

  public execute(
    actor: ICharacter,
    targets: ICharacter[]
  ): BattleActionResult {
    const response = this.item.use(actor, targets);
    
    return response;
  }
}
