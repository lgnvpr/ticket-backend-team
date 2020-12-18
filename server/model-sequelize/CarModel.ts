
import { Car } from "@Core/base-carOwner/Car";
import { DataTypes } from "sequelize";
import { SequelizeAttributes } from "server/base-service/sequelize/SequelizeAttributes";
import {v4 as uuidv4} from "uuid"
import {baseModelSequelize} from "./BaseModel"
export const carModelSequelize: SequelizeAttributes<Car> = {
    ...baseModelSequelize,
    description : {type: DataTypes.TEXT, allowNull: true},
    entryAt : {type: DataTypes.DATE, allowNull: true},
    name : {type: DataTypes.STRING(50), allowNull: true},
    origin : {type: DataTypes.STRING(50), allowNull: true},
    licensePlates  :{type: DataTypes.STRING(50), allowNull: true},
    statusCar : {type: DataTypes.STRING(20), allowNull: true},
};
