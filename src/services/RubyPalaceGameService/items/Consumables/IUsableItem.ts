// items/IUsableItem.ts

import { IItem } from "../IItem";
import { BattleContext, BattleActionTargetType, BattleActionResult } from "../../GameSession";
import { ICharacter } from "../../character";

export interface IUsableItem extends IItem {
  getTargetType(): BattleActionTargetType;
  getMaxTargets(): number;

  canUse(
    context: BattleContext,
    targets: ICharacter[]
  ): boolean;

  use(
    actor: ICharacter,
    targets: ICharacter[]
  ): BattleActionResult;
}
