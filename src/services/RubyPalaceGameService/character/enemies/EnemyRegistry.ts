// character/enemies/EnemyRegistry.ts

import { IEnemyCharacter } from "./IEnemyCharacter";
import { Goblin } from "./types";

type EnemyFactory = () => IEnemyCharacter;

const enemies = {
  goblin: () => new Goblin(),
} satisfies Record<string, EnemyFactory>;

export type EnemyId = keyof typeof enemies;

export class EnemyRegistry {
  private static enemies = enemies;

  public static getEnemy(enemyId: EnemyId): IEnemyCharacter {
    const factory = this.enemies[enemyId];

    if (!factory) {
      throw new Error(`Enemy "${enemyId}" does not exist.`);
    }

    return factory();
  }
}
