import { ICharacter } from "../ICharacter";
import { BattleActionRequest, BattleContext} from "../../GameSession"

export interface IEnemyCharacter extends ICharacter {
  getExperienceReward(): number;
  getGoldReward(): number;
  chooseAction(context: BattleContext): BattleActionRequest;
}
