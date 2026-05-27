// character/enemies/EnemyCharacter.ts

import { IEnemyCharacter } from "./IEnemyCharacter";

import {
  CharacterStats,
  CharacterResources,
  CurrentResources,
} from "../index";

type EnemyCharacterArgs = {
  id?: string;

  characterName: string;

  stats: CharacterStats;

  resources: CharacterResources;

  currentResources?: CurrentResources;

  experienceReward: number;

  goldReward: number;
};

export abstract class EnemyCharacter
  implements IEnemyCharacter {

  protected id: string;

  protected characterName: string;

  protected stats: CharacterStats;

  protected resources: CharacterResources;

  protected currentResources: CurrentResources;

  protected experienceReward: number;

  protected goldReward: number;

  constructor(args: EnemyCharacterArgs) {
    this.id = args.id ?? crypto.randomUUID();

    this.characterName = args.characterName;

    this.stats = args.stats;

    this.resources = args.resources;

    this.currentResources =
      args.currentResources ?? {
        currentHP: args.resources.baseHP,
        currentMP: args.resources.baseMP,
        currentSP: args.resources.baseSP,
      };

    this.experienceReward = args.experienceReward;

    this.goldReward = args.goldReward;
  }

  public getId(): string {
    return this.id;
  }

  public getCharacterName(): string {
    return this.characterName;
  }

  public getMaxHP(): number {
    return this.resources.baseHP;
  }

  public getCurrentHP(): number {
    return this.currentResources.currentHP;
  }

  public getMaxMP(): number {
    return this.resources.baseMP;
  }

  public getCurrentMP(): number {
    return this.currentResources.currentMP;
  }

  public getMaxSP(): number {
    return this.resources.baseSP;
  }

  public getCurrentSP(): number {
    return this.currentResources.currentSP;
  }

  public getStrength(): number {
    return this.stats.strength;
  }

  public getDexterity(): number {
    return this.stats.dexterity;
  }

  public getConstitution(): number {
    return this.stats.constitution;
  }

  public getIntelligence(): number {
    return this.stats.intelligence;
  }

  public getWisdom(): number {
    return this.stats.wisdom;
  }

  public getLuck(): number {
    return this.stats.luck;
  }

  public takeDamage(amount: number): void {
    this.currentResources.currentHP = Math.max(
      0,
      this.currentResources.currentHP - amount
    );
  }

  public heal(amount: number): void {
    this.currentResources.currentHP = Math.min(
      this.getMaxHP(),
      this.currentResources.currentHP + amount
    );
  }

  public fullRestore(): void {
    this.currentResources.currentHP = this.getMaxHP();
    this.currentResources.currentMP = this.getMaxMP();
    this.currentResources.currentSP = this.getMaxSP();
  }

  public spendMana(amount: number): boolean {
    if (this.currentResources.currentMP < amount) {
      return false;
    }

    this.currentResources.currentMP -= amount;

    return true;
  }

  public restoreMana(amount: number): void {
    this.currentResources.currentMP = Math.min(
      this.getMaxMP(),
      this.currentResources.currentMP + amount
    );
  }

  public spendSP(amount: number): boolean {
    if (this.currentResources.currentSP < amount) {
      return false;
    }

    this.currentResources.currentSP -= amount;

    return true;
  }

  public restoreSP(amount: number): void {
    this.currentResources.currentSP = Math.min(
      this.getMaxSP(),
      this.currentResources.currentSP + amount
    );
  }

  public isDead(): boolean {
    return this.currentResources.currentHP <= 0;
  }

  public getExperienceReward(): number {
    return this.experienceReward;
  }

  public getGoldReward(): number {
    return this.goldReward;
  }
}
