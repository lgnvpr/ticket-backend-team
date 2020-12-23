import { Customer } from "@Core/base-carOwner/Customer";
import { serviceName } from "@Core/query/NameService";
import { DataTypes, Model, ModelDefined, Optional, Sequelize } from "sequelize";
import { SequelizeAttributes } from "server/base-service/sequelize/SequelizeAttributes";
import { sequelizeConnect } from ".";
import { baseModelSequelize } from "./BaseModel";


interface Instance extends Model<Customer, Optional<Customer, "id">>, Customer {}
export const customerModelSequelize = sequelizeConnect.define<Instance>(serviceName.customer, {
	...baseModelSequelize,
		description: { type: DataTypes.TEXT, allowNull: true },
		name: { type: DataTypes.STRING(50), allowNull: true },
		CMND: { type: DataTypes.STRING(13), allowNull: true },
		email: { type: DataTypes.STRING(50), allowNull: true },
		imgThumbnailUrl: { type: DataTypes.TEXT, allowNull: true },
		avt: { type: DataTypes.TEXT, allowNull: true },
		birthAt: { type: DataTypes.DATE, allowNull: true },
		phoneNumber: { type: DataTypes.STRING(13), allowNull: true },
		sex: { type: DataTypes.STRING(10), allowNull: true },
});
customerModelSequelize.sync()
