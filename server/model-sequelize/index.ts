import config from "@Config/index";
import { Sequelize } from "sequelize";

export const sequelizeConnect = new Sequelize(config.URLPostgres);