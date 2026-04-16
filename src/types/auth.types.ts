import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export type AuthRequest = Request & {
  user: JwtPayload & {
    _id: string;
    freshLogin: boolean;
    role?: string;
    isAdmin?: boolean;
  };
};

export type LoginBody = {
  name: string;
  password: string;
};