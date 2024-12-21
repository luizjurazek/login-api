import { Router, Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import prisma from "../prisma";
import UserController from "../controllers/UserController";

import { responseType } from "../types/DataTypes";
export default class UserRouter {
  private router: Router;
  private prisma: PrismaClient;
  private userController: UserController;

  constructor() {
    this.router = Router();
    this.prisma = prisma;
    this.userController = new UserController(this.prisma);
    this.Routes();
  }

  private Routes(): void {
    this.router.post("/create-user", async (req: Request, res: Response, next: NextFunction) => {
      // #swagger.tags = ['User']
      // #swagger.description = 'Endpoint to create a user'
      try {
        const { name, email, password } = req.body;
        const user: responseType = await this.userController.createUser({ name, email, password });
        return res.status(user.statusCode).json(user);
      } catch (error) {
        console.log(error);
        next(error);
      }
    });
  }

  public getRouter(): Router {
    return this.router;
  }
}
