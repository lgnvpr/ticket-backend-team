import { PositionStaff } from "@Core/base-carOwner/PositionStaff";
import { serviceName } from "@Core/query/NameService";
import { DataTypes, Model, ModelDefined, Optional, Sequelize } from "sequelize";
import { SequelizeAttributes } from "server/base-service/sequelize/SequelizeAttributes";
import { v4 as uuidv4 } from "uuid";
import { sequelizeConnect } from ".";
import { baseModelSequelize } from "./BaseModel";

interface Instance
	extends Model<PositionStaff, Optional<PositionStaff, "id">>,
		PositionStaff {}
export const positionStaffModelSequelize = sequelizeConnect.define<Instance>(
	serviceName.position,
	{
		...baseModelSequelize,
		description: { type: DataTypes.TEXT, allowNull: true },
		name: { type: DataTypes.STRING(50), allowNull: true },
		keyDefault: { type: DataTypes.STRING(50), allowNull: true },
	}
);
positionStaffModelSequelize.sync();
