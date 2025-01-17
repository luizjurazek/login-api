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

  public async login(data: { email: string; password: string }) {
    const { email, password }: { email: string; password: string } = data;
    const user = await this.userService.getUserByEmail(email);
    if (user === null) {
      const response: controllerResponse = {
        error: true,
        statusCode: statusCode.NOT_FOUND,
        message: "User not found",
        data: {},
      };
      return response;
    }

    const isPasswordValid = await this.userService.isPasswordValid(email, password);

    if (!isPasswordValid) {
      const response: controllerResponse = {
        error: true,
        statusCode: statusCode.BAD_REQUEST,
        message: "Invalid password",
        data: {},
      };
      return response;
    }

    const token = await this.userService.generateTokenJWT(email);

    if (!token) {
      const response: controllerResponse = {
        error: true,
        statusCode: statusCode.INTERNAL_SERVER_ERROR,
        message: "Error generating token",
        data: {},
      };

      return response;
    }

    const response: controllerResponse = {
      error: false,
      statusCode: statusCode.OK,
      message: "Login successful",
      data: token,
    };

    return response;
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
    let response: controllerResponse;
    const users = await this.userService.getAllUsers();
    if (users.length === 0) {
      response = {
        error: false,
        statusCode: statusCode.NOT_FOUND,
        message: "No users found",
      };
      return response;
    } else {
      response = {
        error: false,
        statusCode: statusCode.OK,
        message: "Users found",
        data: users,
      };
    }

    return response;
  }

  public async getUserBydId(userId: number) {
    let response: controllerResponse;
    const user = await this.userService.getUserById(userId);
    if (user === null) {
      response = {
        error: false,
        statusCode: statusCode.NOT_FOUND,
        message: "User not found",
      };
    } else {
      response = {
        error: false,
        statusCode: statusCode.OK,
        message: "User found",
        data: user,
      };
    }

    return response;
  }
}
