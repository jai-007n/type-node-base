import config from "config";
import v1Routes from "../../routes/index.route";
import { type Application } from "express";

export const setupRoutes = (app: Application): void => {
    app.use(config.get<string>("apiPrefix"), v1Routes);
};