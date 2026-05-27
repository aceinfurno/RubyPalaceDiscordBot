import { ICharacter } from "../ICharacter";
import { CharacterStats } from "../CharacterStats";
import { IPlayerClass, CharacterClassId } from  "./playerClasses";
export interface IPlayerCharacter extends ICharacter {
  getUserId(): string;
  getClassId(): CharacterClassId;
  getPlayerClass(): IPlayerClass;
  getLevel(): number;
  getExperience(): number;
  getGold(): number;
  getUnspentStatPoints(): number;
}
