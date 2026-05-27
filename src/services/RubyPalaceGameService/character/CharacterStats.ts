import { CharacterClassId} from "./player";
export type StatName =
  | "strength"
  | "dexterity"
  | "constitution"
  | "intelligence"
  | "wisdom"
  | "luck"
export interface CharacterInfo {
  id: string;
  userId: string;

  characterName: string;

  classId: CharacterClassId;

  level?: number;
  experience?: number;
  unspentStatPoints?: number;
  gold?: number;

  CharacterResources?: CharacterResources;
  currentResources?: CurrentResources;
  allocatedStats?: CharacterStats;
}
export interface CharacterStats {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  luck: number;
}
export interface CharacterResources{
  baseHP: number;
  baseMP: number;
  baseSP: number;
}
export interface CurrentResources{
  currentHP: number;
  currentMP: number;
  currentSP: number;
}
export function createEmptyStats(): CharacterStats {
  return {
    strength: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 0,
    wisdom: 0,
    luck: 0,
  };
}
