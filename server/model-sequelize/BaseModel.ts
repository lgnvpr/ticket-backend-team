import { BaseModel, Status } from "@Core/query/BaseModel";
import { DataTypes, DATE, Model, NOW, Optional, Sequelize } from "sequelize";
import { SequelizeAttributes } from "server/base-service/sequelize/SequelizeAttributes";
import {v4 as uuidv4} from "uuid"
export const baseModelSequelize: SequelizeAttributes<BaseModel> = {
  id: {
    primaryKey: true,
    type: DataTypes.UUID
  },
  status: {
    type: DataTypes.STRING(10),
    defaultValue: Status.active,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: Sequelize.literal('NOW()'),
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('NOW()'),
    allowNull: true
  },
  adminId : {type: DataTypes.UUID, allowNull: true},
  createBy : {type: DataTypes.UUID, allowNull: true},
  updateBy : {type: DataTypes.UUID, allowNull: true},
};
