import { ICharacter } from "../ICharacter";
import { CharacterStats } from "../CharacterStats";
import { IPlayerClass, CharacterClassId } from  "./playerClasses";
import { RewardBundle } from "../../GameSession";
import {Inventory} from "../../items";
export interface IPlayerCharacter extends ICharacter {
  getUserId(): string;
  getClassId(): CharacterClassId;
  getPlayerClass(): IPlayerClass;
  getLevel(): number;
  getExperience(): number;
  getGold(): number;
  getUnspentStatPoints(): number;
  receiveRewards(rewards: RewardBundle): void;

}
