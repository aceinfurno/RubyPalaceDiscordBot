import { prisma } from "../database/prisma";

export class PlayerSaveRepository {
  async findByUserId(userId: string) {
    return prisma.playerSave.findUnique({
      where: { userId },
    });
  }

  async save(userId: string, data: object) {
    return prisma.playerSave.upsert({
      where: { userId },
      update: { data },
      create: { userId, data },
    });
  }
}
