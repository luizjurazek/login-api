import { Router, Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import prisma from "../prisma";
import UserController from "../controllers/UserController";
import errorHandle from "../middleware/errorHandle";

import { controllerResponse } from "../types/DataTypes";
export default class UserRouter {
  private router: Router;
  private prisma: PrismaClient;
  private userController: UserController;

  constructor() {
    this.router = Router();
    this.router.use(errorHandle);
    this.prisma = prisma;
    this.userController = new UserController(this.prisma);
    this.Routes();
  }

  private Routes(): void {
    this.router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email, password }: { email: string; password: string } = req.body;
        const data: controllerResponse = await this.userController.login({ email, password });
        return res.status(data.statusCode).json(data);
      } catch (error) {
        console.log(error);
        next(error);
      }
    });

    this.router.post("/create-user", async (req: Request, res: Response, next: NextFunction) => {
      // #swagger.tags = ['User']
      // #swagger.description = 'Endpoint to create a user'
      try {
        const { name, lastname, roleId, email, password } = req.body;
        const data: controllerResponse = await this.userController.createUser({ name, lastname, roleId, email, password });
        return res.status(data.statusCode).json(data);
      } catch (error) {
        console.log(error);
        next(error);
      }
    });

    this.router.get("/get-users", async (req: Request, res: Response, next: NextFunction) => {
      // #swagger.tags = ['User']
      // #swagger.description = 'Endpoint to get all users'
      try {
        const data: controllerResponse = await this.userController.getAllUsers();
        return res.status(data.statusCode).json(data);
      } catch (error) {
        console.log(error);
        next(error);
      }
    });

    this.router.get("/get-user-by-id/:id", async (req: Request, res: Response, next: NextFunction) => {
      // #swagger.tags = ['User']
      // #swagger.description = 'Endpoint to get user by id'
      const userId: number = parseInt(req.params.id);
      try {
        const data: controllerResponse = await this.userController.getUserBydId(userId);
        return res.status(data.statusCode).json(data);
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
