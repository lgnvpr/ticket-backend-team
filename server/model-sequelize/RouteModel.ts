import { Route } from "@Core/base-carOwner/Route";
import { serviceName } from "@Core/query/NameService";
import { DataTypes, Model, ModelDefined, Optional, Sequelize } from "sequelize";
import { SequelizeAttributes } from "server/base-service/sequelize/SequelizeAttributes";
import { sequelizeConnect } from ".";
import { baseModelSequelize } from "./BaseModel";

interface Instance extends Model<Route, Optional<Route, "id">>, Route {}
export const routeModelSequelize = sequelizeConnect.define<Instance>(serviceName.route, {
	...baseModelSequelize,
	localEnd: { type: DataTypes.STRING(50), allowNull: true },
	localStart: { type: DataTypes.STRING(50), allowNull: true },
	startAt: { type: DataTypes.DATE, allowNull: true },
	sumTimeRun: { type: DataTypes.INTEGER, allowNull: true },
});
routeModelSequelize.sync()
