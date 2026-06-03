// items/ItemRegistry.ts
import { IItem } from "./IItem";
import { Potion } from "./consumables";
const ITEMS = {
   potion: () => new Potion(),
} as const;

export type ItemId = keyof typeof ITEMS;
export class ItemRegistry {
  private static readonly items = ITEMS;


  public static createItem(itemId: ItemId): IItem {
    return this.items[itemId]();
  }
  public static validateItem(itemId: string): ItemId {
    if (!this.has(itemId)) {
      throw new Error("Not a valid item")
    }
    return itemId;
  }

  public static has(itemId: string): itemId is ItemId {
    return itemId in this.items;
  }
}
