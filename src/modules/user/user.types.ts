import mongoose, { HydratedDocument } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  profile_pic?: string;
  role_id?: mongoose.Types.ObjectId | null;
  role?: string | null;
  isAdmin: boolean;
  isActive: boolean;
  remember_me?: string;
  refresh_token?: string;
  freshLogin: boolean;
  last_login_at?: Date | null;

  createdAt: Date;
  updatedAt: Date;

  generateAuthToken(): string;
  generateRefreshToken(): string;
}

export type IUserDocument = HydratedDocument<IUser>;