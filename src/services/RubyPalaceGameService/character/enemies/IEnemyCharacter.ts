import { ICharacter } from "../ICharacter";

export interface IEnemyCharacter extends ICharacter {
  getExperienceReward(): number;
  getGoldReward(): number;
}
