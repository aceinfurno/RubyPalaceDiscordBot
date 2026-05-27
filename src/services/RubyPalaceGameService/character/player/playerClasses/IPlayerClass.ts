import { CharacterStats, CharacterResources } from "../../CharacterStats";
import { CharacterClassId } from "./CharacterClassRegistry";
export interface IPlayerClass {
  getBaseStats(): Readonly<CharacterStats>;
  getBaseResources(): Readonly<CharacterResources>;
  getName(): string;
  getId(): CharacterClassId;
  getDescription(): string;
}
