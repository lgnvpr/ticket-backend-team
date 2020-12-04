import { BaseModel, Status } from "@Core/query/BaseModel";
import { DataTypes, DATE, Model, NOW, Optional } from "sequelize";
import {v4 as uuidv4} from "uuid"
import { SequelizeAttributes } from "./SequelizeAttributes";
export const baseModelSequelize: SequelizeAttributes<BaseModel> = {
  _id: {
    primaryKey: true,
    type: DataTypes.UUID
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: Status.active,
  },
  createAt: {
    type: DataTypes.DATE,
    field: "create_at"
  },
  updateAt: {
    type: DataTypes.DATE,
    field: "update_at"
  },
};
