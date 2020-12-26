import config from "server/config";
import { Trip } from "@Core/base-carOwner/Trip";
import { serviceName } from "@Core/query/NameService";
import { Sequelize, Model, ModelDefined, DataTypes, Optional } from "sequelize";
import { SequelizeAttributes } from "server/base-service/sequelize/SequelizeAttributes";
import { baseModelSequelize } from "./BaseModel";
import { sequelizeConnect } from ".";
import { carModelSequelize } from "./CarModel";
import { routeModelSequelize } from "./RouteModel";
import { staffModelSequelize } from "./StaffModel";



interface Instance extends Model<Trip, Optional<Trip, "id">>, Trip {}
export const tripModelSequelize = sequelizeConnect.define<Instance>(serviceName.trip, {
	...baseModelSequelize,
	carId: { type: DataTypes.UUID, allowNull: true },
	driverId: { type: DataTypes.UUID, allowNull: true },
	price: { type: DataTypes.INTEGER, allowNull: true },
	routeId: { type: DataTypes.UUID, allowNull: true },
	timeStart: { type: DataTypes.DATE, allowNull: true },
});
tripModelSequelize.sync()

tripModelSequelize.belongsTo(carModelSequelize, {
	foreignKey : "carId"
})
tripModelSequelize.belongsTo(routeModelSequelize, {
	foreignKey : "routeId"
})

tripModelSequelize.belongsTo(staffModelSequelize, {
	foreignKey : "driverId",
	as : "drive"
})



