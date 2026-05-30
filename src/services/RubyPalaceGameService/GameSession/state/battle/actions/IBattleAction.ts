import { ICharacter, CharacterStat } from "../../../../character";
import { ActionId } from "./ActionRegistry"
export type DamageType =
  | "physical"
  | "fire"
  | "ice"
  | "lightning"
  | "holy"
  | "shadow";

export type ScalingStat =
  | "strength"
  | "dexterity"
  | "intelligence"
  | "wisdom";

export interface BattleActionConfig {
  id: ActionId;
  name: string;
  description: string;

  targetType: BattleActionTargetType;
  targeting?: {
    maxTargets?: number;
  }

  resourceCost?: {
    hp?: number;
    mp?: number;
    sp?: number;
  };

  damage?: {
    type: DamageType;
    scalingStat: CharacterStat;
    power: number;
    flatBonus?: number;
    defenseStat?: CharacterStat;
  };

  healing?: {
    scalingStat: CharacterStat;
    power: number;
    flatBonus?: number;
  };

  keywords?: BattleActionKeyword[];
}

export type BattleActionKeyword =
  | "melee"
  | "ranged"
  | "spell"
  | "physical"
  | "magical"
  | "can_crit"
  | "ignore_defense"
  | "cannot_miss";
  export type BattleActionTargetType =
    | "enemy"
    | "ally"
    | "self"
    | "all_enemies"
    | "all_allies";

  export interface BattleActionResult {
    message: string;
    damage?: number;
    healing?: number;
    defeated?: boolean;
  }

  export interface IBattleAction {
    getId(): ActionId;

    getName(): string;

    getDescription(): string;

    getTargetType(): BattleActionTargetType;
    getMaxTargets(): number;
    execute(
      user: ICharacter,
      target: ICharacter
    ): BattleActionResult;
  }
