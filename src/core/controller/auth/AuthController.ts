import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User, validatePassword } from "../../../modules/user/user.model";
import errorBag from "../../utility/common";
import { IUser, IUserDocument } from "../../../modules/user/user.types";

import { AuthService } from "./auth.service";
import { LoginBody } from "../../../types/auth.types";


/* =========================
   LOGIN
========================= */

export async function login(req: Request, res: Response): Promise<Response> {
    const { email, password, remember_me } = req.body;

    try {
        const result = await AuthService.login(email, password, remember_me);
        return res.status(result.code).json(result);
    } catch (ex: any) {
        return res.status(500).json({
            status: false,
            code: 500,
            message: ex.message,
        });
    }
}

/* =========================
   LOGOUT
========================= */

export async function logout(req: Request & { user?: IUserDocument }, res: Response): Promise<Response> {
    try {
        const result = await AuthService.logout(req.user?._id);
        return res.status(result.code).json(result);
    } catch (ex: any) {
        return res.status(500).json({
            status: false,
            code: 500,
            message: ex.message,
        });
    }
}

/* =========================
   GET PROFILE
========================= */

export async function getProfile(req: Request & { user?: IUserDocument }, res: Response): Promise<Response> {
    try {
        const result = await AuthService.getProfile(req.user?._id);
        return res.status(result.code).json(result);
    } catch (ex: any) {
        return res.status(500).json({
            status: false,
            code: 500,
            message: ex.message,
        });
    }
}

/* =========================
   UPDATE PROFILE
========================= */



export async function updateProfile(req: Request<{}, any, LoginBody> & { user?: IUserDocument }, res: Response): Promise<Response> {
    const { error } = validatePassword(req.body);
    if (error) {
        return res.status(422).send(errorBag(error));
    }

    try {
        const result = await AuthService.updateProfile(req.body, req.user?._id);
        return res.status(result.code).json(result);
    } catch (ex: any) {
        return res.status(500).json({
            status: false,
            code: 500,
            message: ex.message,
        });
    }
}