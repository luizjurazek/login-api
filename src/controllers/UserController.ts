import { PrismaClient } from "@prisma/client";
import UserService from "../services/UserService";
import { controllerResponse } from "../types/DataTypes";
import statusCode from "../helpers/statusCode";

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

  public async createUser(data: { name: string; lastname: string; roleId: number; email: string; password: string }) {
    const { name, lastname, roleId, email, password } = data;

    if (await this.isUserEmailInUse(email)) {
      const response: controllerResponse = {
        error: true,
        statusCode: statusCode.BAD_REQUEST,
        message: "Email already in use",
        data: {},
      };
      return response;
    }

    const user = await this.userService.createUser({ name, lastname, roleId, email, password });
    const response: controllerResponse = {
      error: false,
      statusCode: statusCode.CREATED,
      message: "User created successfully",
      data: user,
    };
    return response;
  }

  public async getAllUsers() {
    const users = await this.userService.getAllUsers();
    const response: controllerResponse = {
      error: false,
      statusCode: statusCode.OK,
      message: "Users found",
      data: users,
    };

    return response;
  }
}
