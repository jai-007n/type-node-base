import express, { Router, type Request, type Response } from "express";
import { defaultRoutes } from "./default.routes";
import routeConfig from "../lib/routes.config";

const router: Router = express.Router({ caseSensitive: true });

router.get("/hello", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    msg: "Successfully test."
  });
});

if (routeConfig.default) {
  console.log("default routes calling");
  defaultRoutes(router);
}

export default router;