import {IPlayerClass} from "./IPlayerClass";
import {CharacterClassId} from "./CharacterClassRegistry";
import { CharacterStats, CharacterResources } from "../../CharacterStats";

export class BaseClass implements IPlayerClass {
  private baseStats: CharacterStats;
  private baseResources: CharacterResources;
  private name = "Base Class";
  private id: CharacterClassId = "base";
  private description = "Designed for initial testing and prototyping.";
  constructor() {
    this.baseStats = {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      luck: 10
    }
    this.baseResources = {
      baseHP: 100,
      baseMP: 100,
      baseSP: 100
    }
  }

  public getBaseStats(): Readonly<CharacterStats> {
    return { ...this.baseStats};
  }
  public getBaseResources(): Readonly<CharacterResources> {
    return { ...this.baseResources};
  }
  public getName(): string {
    return this.name;
  }
  public getId(): CharacterClassId{
    return this.id;
  }
  public getDescription(): string {
    return this.description;
  }
}
