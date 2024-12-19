import { Router, Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import prisma from "../prisma";

export default class UserRouter {
  private router: Router;
  private prisma: PrismaClient;

  constructor() {
    this.router = Router();
    this.prisma = prisma;
    this.Routes();
  }

  private Routes(): void {
    this.router.post("/create-user", async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { name, email, password } = req.body;
        const user = await this.prisma.user.create({
          data: {
            name,
            email,
            password,
          },
        });

        return res.status(201).json(user);
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
