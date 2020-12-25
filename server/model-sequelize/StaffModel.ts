import { Staff } from "@Core/base-carOwner/Staff";
import { serviceName } from "@Core/query/NameService";
import { DataTypes, Model, ModelDefined, Optional, Sequelize } from "sequelize";
import { SequelizeAttributes } from "server/base-service/sequelize/SequelizeAttributes";
import { sequelizeConnect } from ".";
import { baseModelSequelize } from "./BaseModel";
import { positionStaffModelSequelize } from "./PositionStaffModel";


interface Instance extends Model<Staff, Optional<Staff, "id">>, Staff {}
export const staffModelSequelize = sequelizeConnect.define<Instance>(serviceName.staff, {
	...baseModelSequelize,
		name: { type: DataTypes.STRING(53), allowNull: true },
		address: { type: DataTypes.STRING(200), allowNull: true },
		avt: { type: DataTypes.TEXT, allowNull: true },
		birthAt: { type: DataTypes.DATE, allowNull: true },
		identityCard: { type: DataTypes.STRING(15), allowNull: true },
		phoneNumber: { type: DataTypes.STRING(13), allowNull: true },
		positionId: { type: DataTypes.UUID, allowNull: true },
		sex: { type: DataTypes.STRING(10), allowNull: true },
});
staffModelSequelize.sync()

staffModelSequelize.belongsTo(positionStaffModelSequelize, {
	foreignKey : "positionId"
})