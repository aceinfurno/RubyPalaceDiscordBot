import {ICharacterClass, CharacterStats} from "./index"
export interface IPlayerCharacter {
  getId(): string;
  getUserId(): string;

  getCharacterName(): string;
  getPlayerClass(): ICharacterClass;

  getGold(): number;
  getLevel(): number;
  getExperience(): number;
  getUnspentStatPoints(): number;

  getMaxHP(): number;
  getCurrentHP(): number;

  getMaxMP(): number;
  getCurrentMP(): number;

  getMaxSP(): number;
  getCurrentSP(): number;

  getStrength(): number;
  getDexterity(): number;
  getConstitution(): number;
  getIntelligence(): number;
  getWisdom(): number;
  getLuck(): number;

  takeDamage(amount: number): void;
  heal(amount: number): void;

  fullRestore(): void;

  spendMana(amount: number): boolean;
  restoreMana(amount: number): void;

  spendSP(amount: number): boolean;
  restoreSP(amount: number): void;

  isDead(): boolean;
}
