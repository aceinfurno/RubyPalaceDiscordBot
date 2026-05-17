export interface ICharacter {
  id: string;

  name: string;

  level: number;

  hp: ResourceValue;

  stats: CharacterStats;

  isAlive(): boolean;
}
