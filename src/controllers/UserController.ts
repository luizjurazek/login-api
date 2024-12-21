import { PrismaClient } from "@prisma/client";
import UserService from "../services/UserService";
import { responseType } from "../types/DataTypes";

export default class UserController {
  private prisma: PrismaClient;
  private userService: UserService;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.userService = new UserService(this.prisma);
  }

  public async isUserEmailInUse(email: string) {
    const user = await this.userService.getUserByEmail(email);
    return user !== null;
  }

  public async createUser(data: { name: string; email: string; password: string }) {
    const { name, email, password } = data;

    if (await this.isUserEmailInUse(email)) {
      const response: responseType = {
        statusCode: 400,
        error: true,
        message: "Email already in use",
        data: {},
      };
      return response;
    }

    const user = await this.userService.createUser({ name, email, password });
    const response: responseType = {
      statusCode: 201,
      error: false,
      message: "User created successfully",
      data: user,
    };
    return response;
  }
}
