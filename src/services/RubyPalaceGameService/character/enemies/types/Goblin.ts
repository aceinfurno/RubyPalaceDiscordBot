// character/enemies/types/Goblin.ts

import { EnemyCharacter } from "../EnemyCharacter";
import { BattleActionRequest, BattleContext, ActionId } from "../../../GameSession";

export class Goblin extends EnemyCharacter {
  constructor() {
    super({
      characterName: "Goblin",

      stats: {
        strength: 6,
        dexterity: 10,
        constitution: 5,
        intelligence: 3,
        wisdom: 4,
        luck: 2,
      },

      resources: {
        baseHP: 20,
        baseMP: 5,
        baseSP: 10,
      },

      experienceReward: 10,
      goldReward: 5,
    });
  }
  public chooseAction(context: BattleContext): BattleActionRequest {
    const response: BattleActionRequest = {
      action: "basic_attack",
      targetIds: []
    }
    const target = context.getPlayerId();
    response.targetIds.push(target);
    return response
  }
}
