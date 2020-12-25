import { Account } from "@Core/base-carOwner/Account";
import { Trip } from "@Core/base-carOwner/Trip";
import { serviceName } from "@Core/query/NameService";
import {
	DataTypes,
	Model,
	ModelDefined,
	Optional,
	Sequelize,
	ModelOptions,
} from "sequelize";
import { SequelizeAttributes } from "server/base-service/sequelize/SequelizeAttributes";
import { sequelizeConnect } from ".";
import { baseModelSequelize } from "./BaseModel";
import { staffModelSequelize } from "./StaffModel";


interface Instance extends Model<Account, Optional<Account, "id">>, Account {}
export const accountModelModelSequelize = sequelizeConnect.define<Instance>(
	serviceName.account,
	{
		...baseModelSequelize,
		staffId: { type: DataTypes.UUID, allowNull: true },
		username: { type: DataTypes.STRING(50), allowNull: true },
		password: { type: DataTypes.TEXT, allowNull: true },
		role: { type: DataTypes.UUID, allowNull: true },
	}
);
accountModelModelSequelize.belongsTo(staffModelSequelize, {
	foreignKey : "staffId"
})
accountModelModelSequelize.sync();
