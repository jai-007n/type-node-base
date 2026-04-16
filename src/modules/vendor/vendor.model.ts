// src/models/mysql/user.model.ts
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../setup/mysql";

export class Vendor extends Model {
  public id!: string;
  public email!: string;
  public name!: string;
  public mobile?: string;
  public address?: string;
}

Vendor.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      defaultValue: null
    },
    mobile: {
      type: DataTypes.STRING,
      defaultValue: null
    },
    address: {
      type: DataTypes.STRING,
      defaultValue: null
    },
  },
  {
    sequelize,
    tableName: "vendors",
    // paranoid: true,
    timestamps: true,
    createdAt: "created_at",   // 🔥 rename
    updatedAt: "updated_at",   // 🔥 rename
    // deletedAt: "deleted_at",   // 🔥 rename
  }
);