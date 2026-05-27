// CharacterClassRegistry.ts

import { IPlayerClass } from "./IPlayerClass";
import { BaseClass } from "./BaseClass";
const REGISTERED_CLASSES = {
  base: BaseClass,
} as const;

export type CharacterClassId = keyof typeof REGISTERED_CLASSES;

export class CharacterClassRegistry {
  public static getAvailableClassIds(): CharacterClassId[] {
    return Object.keys(REGISTERED_CLASSES) as CharacterClassId[];
  }

  public static create(classId: CharacterClassId): IPlayerClass {
    const ClassConstructor = REGISTERED_CLASSES[classId];

    return new ClassConstructor();
  }


  public static getAvailableClasses(): IPlayerClass[] {
    return this.getAvailableClassIds().map((classId) =>
      this.create(classId)
    );
  }
}
