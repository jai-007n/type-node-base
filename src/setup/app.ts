import express, { Application, type Request, type Response, type NextFunction } from "express";
import compression from "compression";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import path from "path";
import config from "config";
import { setupRoutes } from "./initializers/setupRoutes";

export default class App {
  private app: Application;

  constructor() {
    this.app = express();

    if (!config.get("JWT_PRIVATE_KEY")) {
      console.log("FATAL ERROR: jwtPrivateKey is not defined");
      process.exit(1);
    }

    this.app.use(helmet());

    this.app.use(
      cors({
        origin: "*",
        preflightContinue: true,
        methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH", "OPTIONS"],
        allowedHeaders: [
          "Origin",
          "X-Requested-With",
          "content-disposition",
          "Content-Type",
          "Accept",
          "Authorization",
          "x-auth-token",
          "x-time-zone",
          "x-hmac-token"
        ]
      })
    );

    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.app.use(cookieParser());

    this.app.use(express.static(path.join(__dirname, "public")));
    this.app.use("/public/", express.static("./public/Images"));

    this.setRoutes();
    this.notFound();
  }

  private setRoutes(): void {
    setupRoutes(this.app);

    this.app.use(
      (err: any, req: Request, res: Response, next: NextFunction) => {
        if (err) {
          return res.status(err.code || 500).json({
            status: false,
            code: err.code || 500,
            message: err.message || "something went wrong"
          });
        }
        next();
      }
    );
  }

  private notFound(): void {
    this.app.use((req: Request, res: Response) => {
      res.status(404).json({
        success: false,
        msg: "Endpoint not found!"
      });
    });
  }

  public getApp(): Application {
    return this.app;
  }

  public getEnv(): string {
    return this.app.get("env");
  }

  public listen(): void {
    const PORT: number = config.get<number>("port") || 5000;

    this.app.listen(PORT, (): void => {
      console.log(`Listening at PORT ${PORT}`);
    });
  }
}