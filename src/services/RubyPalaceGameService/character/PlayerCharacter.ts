// PlayerCharacter.ts

export class PlayerCharacter {
  constructor(
    public id: string,
    public userId: string,

    public name: string,
    public classKey: string,

    public level: number = 1,
    public xp: number = 0,
    public gold: number = 0,

    public strength: number = 5,
    public dexterity: number = 5,
    public constitution: number = 5,
    public intelligence: number = 5,
    public wisdom: number = 5,
    public luck: number = 5,

    public hp: number = 20,
    public maxHp: number = 20,
  ) {}
}
