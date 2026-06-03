// items/IItem.ts
import { ItemId } from "./ItemRegistry";

export interface IItem {
  getId(): ItemId;
  getName(): string;
  getDescription(): string;
  isUsableInBattle(): boolean;
}
