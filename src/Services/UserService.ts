import { PrismaClient } from "@prisma/client";

export default class UserService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  public async createUser(data: { name: string; lastname: string; roleId: number; email: string; password: string }) {
    const { name, lastname, roleId, email, password } = data;
    const user = await this.prisma.user.create({
      data: { name, lastname, roleId, email, password },
    });
    return user;
  }

  // get methods
  public async getUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user;
  }

  public async getAllUsers() {
    const users = await this.prisma.user.findMany();
    return users;
  }
}
