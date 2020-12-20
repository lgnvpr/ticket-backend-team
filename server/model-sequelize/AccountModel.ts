import {Account} from "@Core/base-carOwner/Account"
import { DataTypes } from "sequelize";
import { SequelizeAttributes } from "server/base-service/sequelize/SequelizeAttributes";
import {baseModelSequelize} from "./BaseModel"

export const accountModelModelSequelize: SequelizeAttributes<Account> = {
    ...baseModelSequelize,
    staffId :{type: DataTypes.UUID, allowNull: true},
    username : {type: DataTypes.STRING(50), allowNull: true},
    password : {type: DataTypes.TEXT, allowNull: true},
    role : {type: DataTypes.UUID, allowNull: true},
};
