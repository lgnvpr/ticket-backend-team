/* eslint-disable camelcase */
/* eslint-disable max-len */
"use strict";
import { IFind } from "@Core/query/IFind";
import BaseServiceCustom from "@Service/BaseServiceCustom";
import { Service as MoleculerService, Context } from "moleculer";
import { Action, Method, Service } from "moleculer-decorators";
import { Staff } from "server/base-ticket-team/base-carOwner/Staff";
import { IList } from "server/base-ticket-team/query/IList";
import { serviceName } from "@Core/query/NameService";
import config from "server/config";
import { IGet } from "@Core/query/IGet";
import { staffModelSequelize } from "server/model-sequelize/StaffModel";
import { BaseServiceWithSequelize } from "server/base-service/sequelize/BaseServiceWithSequelize";
import { positionStaffModelSequelize } from "server/model-sequelize/PositionStaffModel";
import { SequelizeDbAdapterProps } from "server/base-service/sequelize/SequelizeDbAdapter";
const MongoDBAdapter = require("moleculer-db-adapter-mongo");
const DbService = require("moleculer-db");
const DBServiceCustom = require("../../base-service/sequelize/DbServiceSequelize");
const SqlAdapter = require("moleculer-db-adapter-sequelize");

@Service({
	name: serviceName.staff,
	mixins: [DBServiceCustom],
	adapter: new SqlAdapter(config.URLPostgres, {
		noSync: false,
	}),
	settings : {
		// populates: [{ field: "position", service: serviceName.position, filedGet : "positionId" }],
	},
	model: {
		name: serviceName.staff,
		define: staffModelSequelize,
	},
	relations :[
		{
			name :serviceName.position,
			type : "belongsTo",
			option : {},
			model : positionStaffModelSequelize,
			relationOptions : {foreignKey : "positionId"}
		}
	],
	dependencies: ["dbCustomSequelize"],
	// collection: serviceName.staff,
})
class StaffService extends BaseServiceWithSequelize<Staff> {

	@Action()
	create(ctx: Context<Staff>){
		return this._sequelizeCreate({
			...ctx.params,
			birthAt : new Date(ctx.params.birthAt || new Date()),
		});
	}
	@Action()
	list(ctx: Context<IList>){
		const get = this.adapter.relations
		console.log(get)
		return this._sequelizeList({
			...ctx.params,
			searchFields : ["name", "identityCard", "address", "phoneNumber", "sex"]
		})
	}
	
}

module.exports = StaffService;
