import { Router } from "express";
import UserRouter from "./UserRouter";

export default class MainRouter {
  private router: Router;
  private userRouter: UserRouter;

  constructor() {
    this.router = Router();
    this.userRouter = new UserRouter();
    this.configureRoutes();
  }

  private configureRoutes(): void {
    this.router.use("/users", this.userRouter.getRouter());
  }

  public getRouter(): Router {
    return this.router;
  }
}
