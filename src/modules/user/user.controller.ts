import { Request, Response } from "express";
import { UserService } from "./user.service";

export const getUsers = async (req: Request, res: Response) => {
  const users = await UserService.getAllUsers();
  res.json(users);
};