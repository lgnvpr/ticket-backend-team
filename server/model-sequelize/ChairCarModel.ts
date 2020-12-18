
import { Car } from "@Core/base-carOwner/Car";
import { ChairCar } from "@Core/base-carOwner/ChairCar";
import { DataTypes } from "sequelize";
import { SequelizeAttributes } from "server/base-service/sequelize/SequelizeAttributes";
import {v4 as uuidv4} from "uuid"
import {baseModelSequelize} from "./BaseModel"
export const chairCarModelSequelize: SequelizeAttributes<ChairCar> = {
    ...baseModelSequelize,
    description : {type: DataTypes.TEXT, allowNull: true},
    name : {type: DataTypes.STRING(50), allowNull: true},
    carId : {type: DataTypes.UUID, allowNull: false},
    localColumn : {type: DataTypes.INTEGER, allowNull: false},
    localFloor : {type: DataTypes.INTEGER, allowNull: false},
    localRow : {type: DataTypes.INTEGER, allowNull: false},
};
