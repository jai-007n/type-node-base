import express, { Router, type Request, type Response } from "express";
// import { LocalLogger } from "../core/utility/logger";

const defaultRouter: Router = express.Router();

export const defaultRoutes = (router: Router): void => {
  router.use("/", defaultRouter);

  // ✅ Ping route
  defaultRouter.get("/ping", (req: Request, res: Response) => {
    console.log(`ℹ️ - Ping route: ${req.url} ${Date.now()}`);

    return res.status(200).json({
      message: "✅ - Pong: test successfully"
    });
  });

  // 🚫 Method not allowed for /ping
  defaultRouter.all("/ping", (req: Request, res: Response) => {
    const code = 405;

    return res.status(code).json({
      code,
      message: `${req.method} method not allowed for route ${req.url}`
    });
  });

  // 🧪 Logger test route
  defaultRouter.get("/logger", (req: Request, res: Response) => {
    //const logger = new LocalLogger("Default", "Default otp logger");

    return res.status(200).json({
      message: `Logger created successfully for ${req.method} ${req.url}`
     // logMessage: logger
    });
  });

  // Optional: 404 handler (uncomment if needed)
  /*
  defaultRouter.all("*", (req: Request, res: Response) => {
    return res.status(404).json({
      code: 404,
      message: `${req.url} not found`
    });
  });
  */
};