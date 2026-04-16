import express, { Router } from "express";

const authRouter: Router = express.Router();
const guestRouter: Router = express.Router();

import * as loginObject from "../core/controller/auth/AuthController";
import auth from "../core/middleware/auth";

export const authRoutes = (router: Router): void => {
  // public routes
  router.use("/auth", guestRouter);

  // protected routes
  router.use("/auth", auth, authRouter);

  // login route
  guestRouter.post("/login", loginObject.login);

  // logout route
  authRouter.get("/logout", loginObject.logout);

  // profile routes
  authRouter
    .route("/profile")
    .get(loginObject.getProfile)
    .post(loginObject.updateProfile);
};