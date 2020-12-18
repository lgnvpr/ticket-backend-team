
import { Car } from "@Core/base-carOwner/Car";
import { ChairCar } from "@Core/base-carOwner/ChairCar";
import { Customer } from "@Core/base-carOwner/Customer";
import { DataTypes } from "sequelize";
import { SequelizeAttributes } from "server/base-service/sequelize/SequelizeAttributes";
import {v4 as uuidv4} from "uuid"
import {baseModelSequelize} from "./BaseModel"
export const customerModelSequelize: SequelizeAttributes<Customer> = {
    ...baseModelSequelize,
    description : {type: DataTypes.TEXT, allowNull: true},
    name : {type: DataTypes.STRING(50), allowNull: true},
    CMND : {type: DataTypes.STRING(13), allowNull: true},
    email: {type: DataTypes.STRING(50), allowNull: true},
    imgThumbnailUrl : {type: DataTypes.TEXT, allowNull: true},
    avt : {type: DataTypes.TEXT, allowNull: true},
    birthAt : {type: DataTypes.DATE, allowNull: true},
    phoneNumber : {type: DataTypes.STRING(13), allowNull: true},
    sex : {type: DataTypes.STRING(10), allowNull: true}
};
