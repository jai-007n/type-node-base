import config from "config";
import jwt from "jsonwebtoken";
import Joi from "joi";
import mongoose, { CallbackWithoutResultAndOptionalError, Document, HydratedDocument, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "./user.types";

const EXCLUDED_FIELDS = ["password", "refresh_token", "__v"] as const;


/* =======================
   Schema
======================= */

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true, minlength: 1, maxlength: 50 },
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1024,
    },
    profile_pic: { type: String, minlength: 5, maxlength: 255 },
    role_id: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      default: null,
    },
    role: { type: String, default: null },
    isAdmin: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    remember_me: { type: String, maxlength: 10000 },
    refresh_token: { type: String, maxlength: 10000 },
    freshLogin: { type: Boolean, default: true },
    last_login_at: { type: Date, default: null },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret) {
        EXCLUDED_FIELDS.forEach((field) => delete ret[field]);
        return ret;
      },
    },
  }
);

/* =======================
   Methods
======================= */

userSchema.methods.generateAuthToken = function (): string {
  return jwt.sign(
    {
      _id: this._id,
      isAdmin: this.isAdmin ?? false,
      last_login_at: this.last_login_at,
      role: this.role,
      freshLogin: this.freshLogin,
    },
    config.get<string>("JWT_PRIVATE_KEY"),
    { expiresIn: "5m" }
  );
};

userSchema.methods.generateRefreshToken = function (): string {
  return jwt.sign(
    {
      _id: this._id,
      isAdmin: this.isAdmin ?? false,
      last_login_at: this.last_login_at,
      role: this.role,
      freshLogin: this.freshLogin,
    },
    config.get<string>("JWT_PRIVATE_REFRESH_KEY"),
    { expiresIn: "90d" }
  );
};

/* =======================
   Virtuals
======================= */

userSchema.virtual("roles", {
  ref: "Role",
  localField: "role_id",
  foreignField: "_id",
  justOne: true,
});

/* =======================
   Hooks
======================= */

userSchema.pre("save", async function () {
  if (this.isNew || this.isModified("password")) {
    this.password = await encryptPassword(this.password);
  }
});

async function encryptPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

userSchema.pre("findOneAndUpdate", function () {
  this.set({ updatedAt: Date.now() });
});


/* =======================
   Model
======================= */

export const User: Model<IUser> = mongoose.model<IUser>(
  "User",
  userSchema
);

/* =======================
   Validation
======================= */

export function validateUser(user: unknown) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(user, { abortEarly: false });
}

export function validatePassword(data: unknown) {
  const schema = Joi.object({
    name: Joi.string()
      .min(1)
      .max(50)
      .regex(/^[a-zA-Z0-9_ .-]*$/)
      .required(),

    password: Joi.string()
      .min(8)
      .max(255)
      .optional()
      .allow("")
      .strict(),

    password_confirmation: Joi.any()
      .equal(Joi.ref("password"))
      .label("Confirm password"),
  });

  return schema.validate(data, {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true,
  });
}

/* =======================
   Utility
======================= */

export const JoiObjectId = () =>
  Joi.string().regex(/^[0-9a-fA-F]{24}$/);