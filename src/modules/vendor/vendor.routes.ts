import express, { Router } from "express";

const vendorRouter: Router = express.Router();

import * as vendorObject from "./vendor.controller";
import auth from "../../core/middleware/auth";

export const vendorRoutes = (router: Router): void => {

    // protected routes
    router.use("/vendor", auth, vendorRouter);

    // profile routes
    // vendorRouter.put(':id', auth, vendorObject.updateVendor);
    vendorRouter.route("/:id")
        .get(vendorObject.getVendor)
        .put(vendorObject.updateVendor);
};
