import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User, validatePassword } from "../../../modules/user/user.model";
import errorBag from "../../utility/common";
import { IUser, IUserDocument } from "../../../modules/user/user.types";
import { Types } from "mongoose";
import { LoginBody } from "../../../types/auth.types";

export class AuthService {
    static async login(email: string, password: string, remember_me?: boolean) {

        const user = await User.findOne({
            email: new RegExp(email, "i"),
        }).select("+password");

        if (!user) {
            return {
                status: false,
                code: 401,
                message: "invalid_email_or_password",
            };
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return {
                status: false,
                code: 401,
                message: "invalid_email_or_password",
            };
        }

        const token = user.generateAuthToken();

        if (remember_me) {
            user.refresh_token = user.generateRefreshToken();
            await user.save();
        }

        return {
            status: true,
            code: 200,
            user,
            token,
            message: "User login Successfully"
        };
    }

    static async logout(userId: Types.ObjectId | undefined) {
        await User.findOneAndUpdate(
            { _id: userId },
            [
                {
                    $set: {
                        freshLogin: { $not: ["$freshLogin"] },
                        refresh_token: null
                    }
                }
            ],
            { updatePipeline: true }
        );

        return {
            status: true,
            code: 200,
            message: "logout successfully",
        };
    }

    static async getProfile(userId: Types.ObjectId | undefined) {
        const user = await User.findById(userId);
        return {
            status: true,
            code: 200,
            user,
            message: "User profile !",
        }
    }

    static async updateProfile(data: LoginBody, userId: Types.ObjectId | undefined) {
        const userExist = await User.findById(userId);

        if (!userExist) {
            return {
                status: false,
                code: 404,
                message: "No user find for given Id.",
            };
        }

        const { name, password } = data;

        if (password) {
            userExist.password = password;
        }

        userExist.name = name;

        await userExist.save();
        return {
            status: true,
            code: 200,
            message: "Profile update successfully.",
            user: userExist,
        }
    }
}