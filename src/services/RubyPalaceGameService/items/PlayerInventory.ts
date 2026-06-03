import {ItemId} from "./ItemRegistry";
export interface InventorySlot {
  itemId: ItemId;
  quantity: number;
}

export class Inventory {
  private readonly items = new Map<ItemId, number>();

  public addItem(itemId: ItemId, quantity = 1): void {
    if (quantity <= 0) {
      throw new Error("Quantity must be greater than 0.");
    }

    const currentQuantity = this.items.get(itemId) ?? 0;
    this.items.set(itemId, currentQuantity + quantity);
  }

  public removeItem(itemId: ItemId, quantity = 1): void {
    if (quantity <= 0) {
      throw new Error("Quantity must be greater than 0.");
    }

    const currentQuantity = this.items.get(itemId) ?? 0;

    if (currentQuantity < quantity) {
      throw new Error(`Not enough ${itemId} in inventory.`);
    }

    const newQuantity = currentQuantity - quantity;

    if (newQuantity === 0) {
      this.items.delete(itemId);
      return;
    }

    this.items.set(itemId, newQuantity);
  }

  public hasItem(itemId: ItemId, quantity = 1): boolean {
    return (this.items.get(itemId) ?? 0) >= quantity;
  }

  public getQuantity(itemId: ItemId): number {
    return this.items.get(itemId) ?? 0;
  }

  public getItems(): InventorySlot[] {
    return Array.from(this.items.entries()).map(([itemId, quantity]) => ({
      itemId,
      quantity,
    }));
  }

  public isEmpty(): boolean {
    return this.items.size === 0;
  }
}
