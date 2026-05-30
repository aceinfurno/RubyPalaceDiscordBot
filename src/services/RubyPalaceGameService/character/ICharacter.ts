import {ActionId} from "../GameSession";
export type CharacterStat =
  | "strength"
  | "dexterity"
  | "constitution"
  | "intelligence"
  | "wisdom"
  | "luck";
export interface ICharacter {
  getId(): string;
  getCharacterName(): string;

  getMaxHP(): number;
  getCurrentHP(): number;

  getMaxMP(): number;
  getCurrentMP(): number;

  getMaxSP(): number;
  getCurrentSP(): number;
  getATK(): number;
  getRangedATK(): number;
  getMagic(): number;
  getDEF(): number;
  getResist(): number;
  getAccuracy(): number;
  getEvasion(): number;

  getStrength(): number;
  getDexterity(): number;
  getConstitution(): number;
  getIntelligence(): number;
  getWisdom(): number;
  getLuck(): number;

  takeDamage(amount: number): void;
  heal(amount: number): void;
  fullRestore(): void;

  spendMP(amount: number): boolean;
  restoreMP(amount: number): void;

  spendSP(amount: number): boolean;
  restoreSP(amount: number): void;

  isDead(): boolean;
  isPlayerControlled(): boolean;
  getSkillIds(): ActionId[];
}
