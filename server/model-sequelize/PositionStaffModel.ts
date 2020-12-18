
import { Car } from "@Core/base-carOwner/Car";
import { ChairCar } from "@Core/base-carOwner/ChairCar";
import { Customer } from "@Core/base-carOwner/Customer";
import { PositionStaff } from "@Core/base-carOwner/PositionStaff";
import { DataTypes } from "sequelize";
import { SequelizeAttributes } from "server/base-service/sequelize/SequelizeAttributes";
import {v4 as uuidv4} from "uuid"
import {baseModelSequelize} from "./BaseModel"
export const positionStaffModelSequelize: SequelizeAttributes<PositionStaff> = {
    ...baseModelSequelize,
    description : {type: DataTypes.TEXT, allowNull: true},
    name : {type: DataTypes.STRING(50), allowNull: true},
    keyDefault :{type: DataTypes.STRING(50), allowNull: true}
};
