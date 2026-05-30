import { IPlayerCharacter} from "./IPlayerCharacter";
import { CharacterStats, CharacterInfo, createEmptyStats} from "../CharacterStats";
import { CharacterClassRegistry, IPlayerClass, CharacterClassId} from "./playerClasses";
import { ActionId} from "../../GameSession";

export class PlayerCharacter implements IPlayerCharacter {
  private id: string;
  private userId: string;

  private characterName: string;

  private playerClass: IPlayerClass;

  private currentHP: number;
  private currentMP: number;
  private currentSP: number;

  private allocatedStats: CharacterStats;

  private level: number;
  private experience: number;
  private unspentStatPoints: number;
  private gold: number;

  constructor(characterInfo: CharacterInfo) {
  this.id = characterInfo.id;
  this.userId = characterInfo.userId;
  this.characterName = characterInfo.characterName;

  this.playerClass = CharacterClassRegistry.create(characterInfo.classId);

  this.level = characterInfo.level ?? 0;
  this.experience = characterInfo.experience ?? 0;
  this.gold = characterInfo.gold ?? 0;
  this.unspentStatPoints = characterInfo.unspentStatPoints ?? 0;

  this.allocatedStats =
    characterInfo.allocatedStats ?? createEmptyStats();

  this.currentHP =
    characterInfo.currentResources?.currentHP ?? this.getMaxHP();

  this.currentMP =
    characterInfo.currentResources?.currentMP ?? this.getMaxMP();

  this.currentSP =
    characterInfo.currentResources?.currentSP ?? this.getMaxSP();

  this.clampResources();
}

public static create(characterInfo: CharacterInfo): IPlayerCharacter{
  return new PlayerCharacter(characterInfo);
}

private clampResources(): void {
  this.currentHP = Math.min(this.currentHP, this.getMaxHP());
  this.currentMP = Math.min(this.currentMP, this.getMaxMP());
  this.currentSP = Math.min(this.currentSP, this.getMaxSP());
}

  // =========================
  // Getters
  // =========================

  public getId(): string {
    return this.id;
  }

  public getUserId(): string {
    return this.userId;
  }
  public getClassId(): CharacterClassId {
    return this.playerClass.getId();
  }
  public getPlayerClass(): IPlayerClass {
    return CharacterClassRegistry.create(this.getClassId())
  }

  public getCharacterName(): string {
    return this.characterName;
  }



  public getMaxHP(): number {
    return this.playerClass.getBaseResources().baseHP + (this.getConstitution() * 5) + this.getStrength();
  }

  public getCurrentHP(): number {
    return this.currentHP;
  }

  public getMaxMP(): number {
    return this.playerClass.getBaseResources().baseMP + (this.getWisdom() * 4 ) + this.getIntelligence();
  }

  public getCurrentMP(): number {
    return this.currentMP;
  }

  public getMaxSP(): number {
    return this.playerClass.getBaseResources().baseSP + (this.getDexterity() * 4) + this.getConstitution();
  }

  public getCurrentSP(): number {
    return this.currentSP;
  }

  public getStrength(): number {
    return this.allocatedStats.strength + this.playerClass.getBaseStats().strength;
  }

  public getDexterity(): number {
    return this.allocatedStats.dexterity + this.playerClass.getBaseStats().dexterity;
  }

  public getConstitution(): number {
    return this.allocatedStats.constitution + this.playerClass.getBaseStats().constitution;
  }

  public getIntelligence(): number {
    return this.allocatedStats.intelligence + this.playerClass.getBaseStats().intelligence;
  }

  public getWisdom(): number {
    return this.allocatedStats.wisdom + this.playerClass.getBaseStats().wisdom;
  }

  public getLuck(): number {
    return this.allocatedStats.luck + this.playerClass.getBaseStats().luck;
  }

  // =========================
  // HP Functions
  // =========================

  public takeDamage(amount: number): void {
    this.currentHP -= amount;

    if (this.currentHP < 0) {
      this.currentHP = 0;
    }
  }
  public fullRestore(){
    this.currentHP = this.getMaxHP();
    this.currentMP = this.getMaxMP();
    this.currentSP = this.getMaxSP();
  }
  public heal(amount: number): void {
    this.currentHP += amount;
    this.clampResources();
  }

  // =========================
  // MP Functions
  // =========================

  public spendMP(amount: number): boolean {
    if (this.currentMP < amount) {
      return false;
    }

    this.currentMP -= amount;
    return true;
  }

  public restoreMP(amount: number): void {
    this.currentMP += amount;
    this.clampResources();
  }

  // =========================
  // SP Functions
  // =========================

  public spendSP(amount: number): boolean {
    if (this.currentSP < amount) {
      return false;
    }

    this.currentSP -= amount;
    return true;
  }

  public restoreSP(amount: number): void {
    this.currentSP += amount;
    this.clampResources();
  }


  public getLevel(): number {
    return this.level;
  }
  public getExperience(): number {
    return this.experience;
  }
  public getUnspentStatPoints(): number{
    return this.unspentStatPoints
  }
  public getGold(): number {
    return this.gold;
  }
  // =========================
  // State Checks
  // =========================

  public isDead(): boolean {
    return this.currentHP <= 0;
  }
  public isPlayerControlled(): boolean{
    return true;
  }

  // =========================
  // Combat Functions
  // =========================
  public getSkillIds(): ActionId[]{
    return ["power_strike"];
  }
  public getATK(): number {
    return Math.floor(this.getStrength() * 1.3) + Math.floor(this.getDexterity() * .25);// + this.getWAP();
  }
  public getRangedATK(): number {
    return this.getStrength() + Math.floor(this.getLuck() * .3) + Math.floor(this.getDexterity() * .2);// + this.getWAP();
  }
  public getMagic(): number {
    return Math.floor(1.3 * this.getIntelligence()) + Math.floor(.2 * this.getWisdom());// + this.getWAP();
  }
  public getDEF(): number {
    return this.getConstitution();// this.getArmDef();
  }
  public getResist(): number {
    return this.getWisdom(); //+ this.getArmRes();
  }
  public getAccuracy(): number {
    return 0;
  }
  public getEvasion(): number {
    return 0;
  }


}
