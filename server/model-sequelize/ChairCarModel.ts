import { ChairCar } from "@Core/base-carOwner/ChairCar";
import { serviceName } from "@Core/query/NameService";
import { DataTypes, Model, ModelDefined, Optional, Sequelize } from "sequelize";
import { SequelizeAttributes } from "server/base-service/sequelize/SequelizeAttributes";
import { sequelizeConnect } from ".";
import { baseModelSequelize } from "./BaseModel";


interface Instance extends Model<ChairCar, Optional<ChairCar, "id">>, ChairCar {}
export const chairCarModelSequelize = sequelizeConnect.define<Instance>(
	serviceName.chairCar,
	{
		...baseModelSequelize,
		description: { type: DataTypes.TEXT, allowNull: true },
		name: { type: DataTypes.STRING(50), allowNull: true },
		carId: { type: DataTypes.UUID, allowNull: false },
		localColumn: { type: DataTypes.INTEGER, allowNull: false },
		localFloor: { type: DataTypes.INTEGER, allowNull: false },
		localRow: { type: DataTypes.INTEGER, allowNull: false },
	}
);
chairCarModelSequelize.sync();
