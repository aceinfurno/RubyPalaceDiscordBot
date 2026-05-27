// character/enemies/types/Goblin.ts

import { EnemyCharacter } from "../EnemyCharacter";

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
}
