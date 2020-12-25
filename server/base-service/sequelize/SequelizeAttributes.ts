import { BaseModel } from "@Core/query/BaseModel";
import { DataTypeAbstract, Model, ModelAttributeColumnOptions, ModelDefined, Optional, Sequelize } from "sequelize";

type SequelizeAttribute =
  | string
  | DataTypeAbstract
  | ModelAttributeColumnOptions;

export type SequelizeAttributes<T extends { [key: string]: any }> = {
  [P in keyof T]: SequelizeAttribute;
};


