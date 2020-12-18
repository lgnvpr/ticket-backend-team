
import { Route } from "@Core/base-carOwner/Route";
import { DataTypes } from "sequelize";
import { SequelizeAttributes } from "server/base-service/sequelize/SequelizeAttributes";
import {baseModelSequelize} from "./BaseModel"
export const routeModelSequelize: SequelizeAttributes<Route> = {
    ...baseModelSequelize,
    localEnd :{type: DataTypes.STRING(50), allowNull: true},
    localStart :{type: DataTypes.STRING(50), allowNull: true},
    startAt :{type: DataTypes.DATE, allowNull: true},
    sumTimeRun :{type: DataTypes.INTEGER, allowNull: true},
};
