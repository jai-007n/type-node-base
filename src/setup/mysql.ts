import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("learn_things", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});