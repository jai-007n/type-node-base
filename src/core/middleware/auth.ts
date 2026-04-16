import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";
import config from "config";
import { User } from "../../modules/user/user.model";
import { IUserDocument } from "../../modules/user/user.types";
import { AuthRequest } from "../../types/auth.types";

/* =========================
   Middleware
========================= */

export default async function auth(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    const token = req.header("x-auth-token");

    if (!token) {
        return res.status(401).json({
            status: false,
            code: 401,
            message: "Unauthenticated user",
        });
    }

    try {
        const authReq = req as AuthRequest;
        authReq.user = jwt.verify(
            token,
            config.get<string>("JWT_PRIVATE_KEY")
        ) as AuthRequest["user"];

        const userActive = await User.findById(authReq?.user._id);

        if (authReq.user?.freshLogin !== userActive?.freshLogin) {
            return res.status(401).json({
                status: false,
                code: 401,
                message: "Unauthenticated user",
            });
        }
        next();
    } catch (ex: any) {
        if (ex.name === "TokenExpiredError") {
            const decodedToken = jwtDecode<JwtPayload>(token);

            const userActive = await User.findById(decodedToken._id);

            if (userActive?.refresh_token) {
                try {
                    jwt.verify(
                        userActive.refresh_token,
                        config.get<string>("JWT_PRIVATE_REFRESH_KEY")
                    );

                    const newAccessToken = userActive.generateAuthToken();

                    const newRefreshToken = userActive.generateRefreshToken();

                    userActive.refresh_token = newRefreshToken;
                    await userActive.save();

                    return res.status(401).json({
                        status: true,
                        isNewToken: true,
                        code: 401,
                        token: newAccessToken,
                        message: "Token Refreshed",
                    });
                } catch (error) {
                    return res.status(401).json({
                        status: false,
                        code: 401,
                        message: "Invalid Token or expired R",
                    });
                }
            }
        }

        return res.status(401).json({
            status: false,
            code: 401,
            message: "Invalid Token or expired",
        });
    }
}