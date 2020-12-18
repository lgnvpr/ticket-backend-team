
import { Route } from "@Core/base-carOwner/Route";
import { Staff } from "@Core/base-carOwner/Staff";
import { Ticket } from "@Core/base-carOwner/Ticket";
import { Trip } from "@Core/base-carOwner/Trip";
import { DataTypes } from "sequelize";
import { SequelizeAttributes } from "server/base-service/sequelize/SequelizeAttributes";
import {baseModelSequelize} from "./BaseModel"
export const tripModelSequelize: SequelizeAttributes<Trip> = {
    ...baseModelSequelize,
    carId :{type: DataTypes.UUID, allowNull: true},
    driveId : {type: DataTypes.UUID, allowNull: true},
    price : {type: DataTypes.INTEGER, allowNull: true},
    routeId : {type: DataTypes.UUID, allowNull: true},
    timeStart : {type: DataTypes.DATE, allowNull: true}
};
