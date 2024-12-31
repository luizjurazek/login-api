import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export default class UserService {
  private prisma: PrismaClient;
  private bcrypt: typeof bcrypt;
  private jwt: typeof jwt;
  private SECRET_JWT: string | undefined = JWT_SECRET;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.bcrypt = bcrypt;
    this.jwt = jwt;
  }

  public async createUser(data: { name: string; lastname: string; roleId: number; email: string; password: string }) {
    const { name, lastname, roleId, email, password } = data;
    const hashedPassword = await this.bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: { name, lastname, roleId, email, password: hashedPassword },
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

  public async getUserById(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    return user;
  }

  public async isPasswordValid(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (user === null) {
      return false;
    }
    const isPasswordValid = await this.bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return false;
    }

    return true;
  }

  public async generateTokenJWT(email: string): Promise<boolean | object> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (user === null) {
      return false;
    }

    if (this.SECRET_JWT === undefined) {
      return false;
    }

    const expiresIn = "24h";
    const token: string = this.jwt.sign({ id: user.id, email: user.email }, this.SECRET_JWT, { expiresIn: expiresIn });
    const response: object = {
      user: {
        id: user.id,
        email: user.email,
        roleId: user.role.role,
      },
      token,
      expiresIn,
    };
    return response;
  }
}
