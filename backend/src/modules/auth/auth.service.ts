import { prisma } from "../../config/prisma.config";

export class AuthService {
  static async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  static async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  static async createUser(data: { email: string; passwordHash: string; name?: string }) {
    return prisma.user.create({
      data: {
        email: data.email,
        password: data.passwordHash,
        name: data.name || null,
        role: "USER",
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
