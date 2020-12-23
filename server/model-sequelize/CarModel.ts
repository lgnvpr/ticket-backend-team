import { Car } from "@Core/base-carOwner/Car";
import { serviceName } from "@Core/query/NameService";
import { DataTypes, Model, ModelDefined, Optional, Sequelize } from "sequelize";
import { SequelizeAttributes } from "server/base-service/sequelize/SequelizeAttributes";
import { sequelizeConnect } from ".";
import { baseModelSequelize } from "./BaseModel";

interface Instance extends Model<Car, Optional<Car, "id">>, Car {}

export const carModelSequelize = sequelizeConnect.define<Instance>(
	serviceName.car,
	{
		...baseModelSequelize,
		description: { type: DataTypes.TEXT, allowNull: true , field : "description"},
		entryAt: { type: DataTypes.DATE, allowNull: true , field:  "entryAt"},
		name: { type: DataTypes.STRING(50), allowNull: true ,  field:  "name"},
		origin: { type: DataTypes.STRING(50), allowNull: true,  field:  "origin" },
		licensePlates: { type: DataTypes.STRING(50), allowNull: true,  field:  "licensePlates" },
		statusCar: { type: DataTypes.STRING(20), allowNull: true,  field:  "statusCar" },
	}
);
carModelSequelize.sync();
