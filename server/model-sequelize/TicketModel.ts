import config from "@Config/index";
import { Ticket } from "@Core/base-carOwner/Ticket";
import { serviceName } from "@Core/query/NameService";
import { DataTypes, Model, ModelDefined, Optional, Sequelize } from "sequelize";
import { SequelizeAttributes } from "server/base-service/sequelize/SequelizeAttributes";
import { sequelizeConnect } from ".";
import { baseModelSequelize } from "./BaseModel";
import { chairCarModelSequelize } from "./ChairCarModel";
import { customerModelSequelize } from "./CustomerModel";
import { tripModelSequelize } from "./TripModel";


interface Instance extends Model<Ticket, Optional<Ticket, "id">>, Ticket {}
export const ticketModelSequelize = sequelizeConnect.define<Instance>(serviceName.ticket, {
	...baseModelSequelize,
	chairCarId: { type: DataTypes.UUID, allowNull: true },
	customerId: { type: DataTypes.UUID, allowNull: true },
	description: { type: DataTypes.TEXT, allowNull: true },
	localDrop: { type: DataTypes.STRING(200), allowNull: true },
	localPickup: { type: DataTypes.STRING(200), allowNull: true },
	statusTicket: { type: DataTypes.STRING(20), allowNull: true },
	tripId: { type: DataTypes.UUID, allowNull: true },
});
ticketModelSequelize.belongsTo(tripModelSequelize, {
	foreignKey : "tripId"
})
ticketModelSequelize.belongsTo(chairCarModelSequelize, {
	foreignKey : "chairCarId"
})
ticketModelSequelize.belongsTo(customerModelSequelize, {
	foreignKey : "customerId"	
})



