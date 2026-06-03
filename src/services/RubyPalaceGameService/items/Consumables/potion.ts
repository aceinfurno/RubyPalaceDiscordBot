// items/consumables/Potion.ts
import { Item } from "../Item";
import { UsableItem } from "./UsableItem";
import { ICharacter } from "../../character";
import { BattleContext, BattleActionResult } from "../../GameSession";
export class Potion extends UsableItem {

  constructor() {
    super(
      "potion",
      "Potion",
      "Restores 25 HP."
    );
  }

  public getTargetType(): "ally" {
    return "ally";
  }

  public canUse(
    context: BattleContext,
    targets: ICharacter[],
  ): boolean {
    return targets.every(target => !target.isDead());
  }

  protected executeUse(
    actor: ICharacter,
    targets: ICharacter[],
  ): BattleActionResult {
    const messages: string[] = [];
    for (const target of targets) {
      target.heal(25);
      messages.push(`${actor.getCharacterName()} used ${this.getName()} on ${target.getCharacterName()}. ${target.getCharacterName()} recovered 25 HP.`
    );
    }
    return{
      message: messages.join("\n"),
      defeated: false,
    };
  }
}
