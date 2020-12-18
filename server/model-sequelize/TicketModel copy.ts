
import { Route } from "@Core/base-carOwner/Route";
import { Staff } from "@Core/base-carOwner/Staff";
import { Ticket } from "@Core/base-carOwner/Ticket";
import { DataTypes } from "sequelize";
import { SequelizeAttributes } from "server/base-service/sequelize/SequelizeAttributes";
import {baseModelSequelize} from "./BaseModel"
export const ticketModelSequelize: SequelizeAttributes<Ticket> = {
    ...baseModelSequelize,
    chairCarId :{type: DataTypes.UUID, allowNull: true},
    customerId : {type: DataTypes.UUID, allowNull: true},
    description : {type: DataTypes.TEXT, allowNull: true},
    localDrop : {type: DataTypes.STRING(200), allowNull: true},
    localPickup : {type: DataTypes.STRING(200), allowNull: true},
    statusTicket : {type: DataTypes.STRING(20), allowNull: true},
    tripId : {type: DataTypes.UUID, allowNull: true},
};
