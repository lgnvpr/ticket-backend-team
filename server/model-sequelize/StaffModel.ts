
import { Route } from "@Core/base-carOwner/Route";
import { Staff } from "@Core/base-carOwner/Staff";
import { DataTypes } from "sequelize";
import { SequelizeAttributes } from "server/base-service/sequelize/SequelizeAttributes";
import {baseModelSequelize} from "./BaseModel"
export const staffModelSequelize: SequelizeAttributes<Staff> = {
    ...baseModelSequelize,
    name :{type: DataTypes.STRING(53), allowNull: true},
    address : {type: DataTypes.STRING(200), allowNull: true},
    avt : {type: DataTypes.TEXT, allowNull: true},
    birthAt : {type: DataTypes.DATE, allowNull: true},
    identityCard : {type: DataTypes.STRING(15), allowNull: true},
    phoneNumber : {type: DataTypes.STRING(13), allowNull: true},
    positionId : {type: DataTypes.UUID, allowNull: true},
    sex : {type: DataTypes.STRING(10), allowNull: true},
};
