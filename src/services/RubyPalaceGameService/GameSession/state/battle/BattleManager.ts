import {IEnemyCharacter, IPlayerCharacter, ICharacter} from "../../../character";
export class BattleManager{
  private battlers: ICharacter[];

  constructor(enemies: IEnemyCharacter[], activePlayer: IPlayerCharacter) {
    this.battlers = enemies;
    this.battlers.push(activePlayer);
    this.setInitiative();
  }
  private setInitiative(){
    const initiativeOrder = this.battlers.map(battler =>
      ({
        battler,
        initative: battler.getDexterity() + this.roll(1,20)
      }));
      initiativeOrder.sort((a,b) => b.initative - a.initative);
      this.battlers = initiativeOrder.map(entry => entry.battler);
  }
  private roll(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
