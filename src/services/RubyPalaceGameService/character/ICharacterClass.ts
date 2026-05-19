import { CharacterStats, CharacterResources } from "./index";

export interface ICharacterClass {
  getBaseStats(): Readonly<CharacterStats>;
  getBaseResources(): Readonly<CharacterResources>;
  getName(): string;
  getId(): string;
  getDescription(): string;
}
