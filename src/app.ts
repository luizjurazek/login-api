import express from "express";
import { Express, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import * as swaggerFile from "../swagger_output.json";
import MainRouter from "./routes/MainRouter";

const app: Express = express();
const mainRouter = new MainRouter();

// setup for use json on requests
app.use(express.json());

// setup for swagger
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Routes
app.use("/api", mainRouter.getRouter());

export default app;
