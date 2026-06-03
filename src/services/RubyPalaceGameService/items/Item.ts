// items/Item.ts
import { IItem } from "./IItem";
import { ItemId } from "./ItemRegistry";

export abstract class Item implements IItem {
  constructor(
    private readonly id: ItemId,
    private readonly name: string,
    private readonly description: string
  ) {}

  public getId(): ItemId {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getDescription(): string {
    return this.description;
  }

  public isUsableInBattle(): boolean {
    return false;
  }
}
