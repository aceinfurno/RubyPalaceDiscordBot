import {IEnemyCharacter, IPlayerCharacter, ICharacter} from "../../../character";
import { ActionId, IBattleAction, ActionRegistry } from "./actions";
export type BattlePhase =
  | "action_select"
  | "target_select"
  | "battle_over";
export interface BattleActionRequest {
  action: ActionId;
  targetIds: string[];
}
export class BattleContext {
  constructor (
    private readonly battlers: ICharacter[],
    private readonly currentActor: ICharacter
  ) {}
  public getCurrentActor(): ICharacter {
    return this.currentActor;
  }
  public getPlayerId(): string {
    const player = this.battlers.find(
      battler => battler.isPlayerControlled() && !battler.isDead()
    );

    if (!player) {
      throw new Error("No living player found.");
    }

    return player.getId();
  }

  public getBattlers(): ICharacter[] {
    return [...this.battlers];
  }

  public getLivingPlayers(): ICharacter[] {
    return this.battlers.filter(
      battler =>
        battler.isPlayerControlled() &&
        !battler.isDead()
    );
  }

  public getLivingEnemies(): ICharacter[] {
    return this.battlers.filter(
      battler =>
        !battler.isPlayerControlled() &&
        !battler.isDead()
    );
  }
}
export class BattleManager{
  private turnQueue: ICharacter[];
  private currentActor: ICharacter;
  private battlePhase: BattlePhase;
  private selectedAction: IBattleAction | undefined;
  private battleLog: string[] = [];
  private defeatedEnemies: IEnemyCharacter[] = [];
  private selectedTargetIds: string[] = [];

  constructor(enemies: IEnemyCharacter[], activePlayer: IPlayerCharacter) {
    this.turnQueue = [...enemies];
    this.turnQueue.push(activePlayer);
    this.battlePhase = "action_select";
    this.setInitiative();
    this.currentActor = this.ensureActor(this.turnQueue.shift());
    this.addBattleLog("Battle started!");
    this.advanceUntilPlayerTurn()
  }
  private ensureActor(currentActor: ICharacter | undefined): ICharacter {
    if (!currentActor) {
      throw new Error("No current Actor");
    }
    return currentActor;
  }
  public continuePlayerTurn(): void {

    if (!this.selectedAction) {
      this.battlePhase = "action_select";
      return;
    }

    if (this.needsTargets() && this.selectedTargetIds.length === 0) {
      this.battlePhase = "target_select";
      return;
    }

    this.executeAction();
    this.endTurn();
    this.advanceUntilPlayerTurn();
}

  private executeAction(): void {
    if (!this.selectedAction) {
      throw new Error("Cannot execute without selected action.");
    }

    const action = this.selectedAction;
    const targets = this.getSelectedTargetCharacters();

    for (const target of targets) {
      const result = action.execute(this.currentActor, target);

      this.addBattleLog(result.message);
    }


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
  private advanceUntilPlayerTurn(): void {
    while (true) {

      if (this.isBattleOver()) {
        this.battlePhase = "battle_over";
        return;
      }
      this.startTurn();
      if (this.currentActor.isPlayerControlled()) {
        this.continuePlayerTurn();
        return;
      }

      this.executeEnemyTurn();
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
  }
  private getAction(actionId: ActionId): IBattleAction{
    return ActionRegistry.createAction(actionId);
  }


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
    this.selectedAction = undefined;
    this.battlePhase = "action_select";
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
  private startTurn(): void {
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
    if (this.currentActor.isPlayerControlled()) {
      throw new Error("Tried to execute enemy turn for player.");
    }

    const enemy = this.currentActor as IEnemyCharacter;
    const request = enemy.chooseAction(this.getBattleContext());

    this.selectedAction = this.getAction(request.action);
    this.selectedTargetIds = request.targetIds;
    this.executeAction();
    this.endTurn();
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
    this.selectedAction = undefined;
    this.selectedTargetIds = [];
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
  private getBattleContext(): BattleContext{
    return new BattleContext(this.getAllBattlers(), this.currentActor);
  }
  private needsTargets(): boolean {
    if (!this.selectedAction) {
      return false;
    }

    return this.selectedAction.getTargetType() !== "self";
  }
  private roll(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
