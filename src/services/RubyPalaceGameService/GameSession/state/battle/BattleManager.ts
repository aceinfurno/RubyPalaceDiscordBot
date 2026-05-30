import {IEnemyCharacter, IPlayerCharacter, ICharacter} from "../../../character";
import { ActionId, IBattleAction, ActionRegistry } from "./actions";
export type BattlePhase =
  | "resolving"
  | "action_select"
  | "skill_select"
  | "target_select"
  | "confirm_action"
  | "battle_over";
export class BattleManager{
  private turnQueue: ICharacter[];
  private currentActor: ICharacter;
  private battlePhase: BattlePhase;
  private selectedAction: IBattleAction | undefined;
  private battleLog: string[] = [];
  private defeatedEnemies: IEnemyCharacter[] = [];

  constructor(enemies: IEnemyCharacter[], activePlayer: IPlayerCharacter) {
    this.turnQueue = [...enemies];
    this.turnQueue.push(activePlayer);
    this.setInitiative();
    this.currentActor = this.ensureActor(this.turnQueue.shift());
    this.battlePhase = "resolving";
    this.addBattleLog("Battle started!");
    this.advanceUntilPlayerTurn()
  }
  private ensureActor(currentActor: ICharacter | undefined): ICharacter {
    if (!currentActor) {
      throw new Error("No current Actor");
    }
    return currentActor;
  }
  public confirmSelectedTargets(): void {
    if (!this.selectedAction) {
      throw new Error("Cannot confirm targets without a selected action.");
    }

    if (this.selectedTargetIds.length === 0) {
      throw new Error("Cannot confirm action without selecting a target.");
    }

    const targets = this.getSelectedTargetCharacters();

    for (const target of targets) {
      const result = this.selectedAction.execute(
        this.currentActor,
        target
      );

      this.addBattleLog(result.message);
    }

    this.selectedAction = undefined;
    this.selectedTargetIds = [];

    this.battlePhase = "resolving";

    this.cleanupAfterAction();
}
  private setInitiative(){
    const initiativeOrder = this.turnQueue.map(battler =>
      ({
        battler,
        initative: battler.getDexterity() + this.roll(1,20)
      }));
      initiativeOrder.sort((a,b) => b.initative - a.initative);
      this.turnQueue = initiativeOrder.map(entry => entry.battler);
  }
  private getSelectedTargetCharacters(): ICharacter[] {
    return this.selectedTargetIds.map((targetId) => {
      const target = this.getAllBattlers().find(
        battler => battler.getId() === targetId
      );

      if (!target) {
        throw new Error(`Could not find target '${targetId}'.`);
      }

      return target;
    });
}
  private getAllBattlers(): ICharacter[] {
    return [
      this.currentActor,
      ...this.turnQueue,
    ];
  }
  public getBattlePhase(): BattlePhase {
    return this.battlePhase;
  }
  public advanceUntilPlayerTurn(): void {
    if (this.battlePhase !== "resolving") {
      return;
    }

    while (this.battlePhase === "resolving") {
      if (this.isBattleOver()) {
        this.battlePhase = "battle_over";
        return;
      }

      if (this.currentActor.isPlayerControlled()) {
        this.startPlayerTurn();
        return;
      }

      this.executeEnemyTurn();
      this.endTurn();
    }
}
  public getSelectedAction(): IBattleAction {
    if (!this.selectedAction) {
      throw new Error("No battle action is currently selected.");
    }

    return this.selectedAction;
  }
  public selectAction(actionId: ActionId): void {
    const selectedAction = this.getAction(actionId);
    if (!selectedAction) {
      throw new Error("No action assigned to Battle Manager");
    }
    this.selectedAction = selectedAction;
    if (selectedAction.getTargetType() === "self") {
      this.battlePhase = "confirm_action";
      return;
    }

    if (selectedAction.getTargetType() === "enemy") {
      this.battlePhase = "target_select";
      return;
    }

    if (selectedAction.getTargetType() === "all_enemies") {
      this.battlePhase = "confirm_action";
      return;
    }

    throw new Error(
      `Unhandled target type: ${selectedAction.getTargetType()}`
    );
  }
  private getAction(actionId: ActionId): IBattleAction{
    return ActionRegistry.createAction(actionId);
  }
  private selectedTargetIds: string[] = [];

  public getSelectedTargets(): string[] {
    return this.selectedTargetIds;
  }

  public toggleTarget(targetId: string): void {
    if (!this.selectedAction) {
      throw new Error("Cannot select target without an action.");
    }

    const existingIndex = this.selectedTargetIds.indexOf(targetId);

    if (existingIndex >= 0) {
      this.selectedTargetIds.splice(existingIndex, 1);
      return;
    }

    const maxTargets = this.selectedAction.getMaxTargets();

    if (this.selectedTargetIds.length >= maxTargets) {
      this.selectedTargetIds.shift();
    }

    this.selectedTargetIds.push(targetId);
  }

  public canConfirmTargets(): boolean {
    return this.selectedTargetIds.length > 0;
  }
  public cancelTargetSelection(): void {
    this.selectedTargetIds = [];
    this.battlePhase = "skill_select";
  }
  public getValidTargetsForSelectedAction(): ICharacter[] {
  if (!this.selectedAction) {
    throw new Error("No selected action.");
  }

  const targetType = this.selectedAction.getTargetType();

  if (targetType === "enemy") {
    return this.turnQueue.filter(
      battler =>
        !battler.isPlayerControlled() &&
        battler.getCurrentHP() > 0
    );
  }

  if (targetType === "ally") {
    return this.turnQueue.filter(
      battler =>
        battler.isPlayerControlled() &&
        battler.getCurrentHP() > 0
    );
  }

  if (targetType === "self") {
    return [this.currentActor];
  }

  throw new Error(`Target type ${targetType} does not use manual target selection.`);
}
  private startPlayerTurn(): void {
    this.battlePhase = "action_select";
    this.addBattleLog(`${this.currentActor.getCharacterName()}'s turn.`);
  }
  private advanceTurn(): void{
    if (!this.currentActor.isDead()){
      this.turnQueue.push(this.currentActor);
   }
    const nextActor = this.turnQueue.shift();
    if (!nextActor) {
      throw new Error("No battlers available");
    }
    this.currentActor = nextActor;
  }
  public executeEnemyTurn(): void{
    
  }
  public getCurrentBattler(): ICharacter{
    return this.currentActor;
  }
  public addBattleLog(message: string): void {
    this.battleLog.push(message);

  // Keep only the most recent entries
    if (this.battleLog.length > 10) {
      this.battleLog.shift();
    }
  }
  public getBattleLog(): string[] {
    return [...this.battleLog];
  }
  public setBattlePhase(phase: BattlePhase): void {
    this.battlePhase = phase;
}

  private cleanupAfterAction(): void {
    this.processDefeatedBattlers();

    if (this.isBattleOver()) {
      this.battlePhase = "battle_over";
      return;
    }

    this.advanceTurn();
    this.advanceUntilPlayerTurn();
}

  private processDefeatedBattlers(): void {
    const allBattlers = this.getAllBattlers();

    const defeatedEnemies = allBattlers.filter(
      (battler): battler is IEnemyCharacter =>
      !battler.isPlayerControlled() &&
      battler.isDead()
    );

    this.defeatedEnemies.push(
      ...defeatedEnemies.filter(
        enemy => !this.defeatedEnemies.includes(enemy)
      )
    );

    this.turnQueue = this.turnQueue.filter(
      battler => !battler.isDead()
  );
  }
  private beginTurn(): void {

  }
  private executeTurn(): void {

  }
  private endTurn(): void {
    this.processDefeatedBattlers();

    if (this.isBattleOver()) {
      this.battlePhase = "battle_over";
      return;
    }

  this.advanceTurn();
}
  public isBattleOver(): boolean {
  const livingPlayers = this.getAllBattlers().some(
    battler => battler.isPlayerControlled() && !battler.isDead()
  );

  const livingEnemies = this.getAllBattlers().some(
    battler => !battler.isPlayerControlled() && !battler.isDead()
  );

  return !livingPlayers || !livingEnemies;
}
  public getEnemies(): IEnemyCharacter[] {
    return this.getAllBattlers().filter(
      (battler): battler is IEnemyCharacter =>
        !battler.isPlayerControlled() && !battler.isDead()
      );
    }
  private roll(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
