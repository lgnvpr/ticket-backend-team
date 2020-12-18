/* eslint-disable camelcase */
/* eslint-disable max-len */
"use strict";
import { Car } from "@Core/base-carOwner/Car";
import { IFind } from "@Core/query/IFind";
import BaseServiceCustom from "@Service/BaseServiceCustom";
import { Service as MoleculerService, Context } from "moleculer";
import { Action, Method, Service } from "moleculer-decorators";
import { Staff } from "server/base-ticket-team/base-carOwner/Staff";
import { IList } from "server/base-ticket-team/query/IList";
import { serviceName } from "@Core/query/NameService";
import config from "server/config";
import { Paging } from "@Core/query/Paging";
import { IGet } from "@Core/query/IGet";
import { ValidateHelper } from "server/helper/ValidateHelper";
import { carModelSequelize } from "server/model-sequelize/CarModel";
import { BaseServiceWithSequelize } from "server/base-service/sequelize/BaseServiceWithSequelize";
import { ChairCarServerController } from "server/controller-server/ChairCarServerController";
import { chairCarControllerServer } from "server/controller-server";
import { staffModelSequelize } from "server/model-sequelize/StaffModel";
import jwt from 'jsonwebtoken';
const MongoDBAdapter = require("moleculer-db-adapter-mongo");
const DbService = require("moleculer-db");
const DBServiceCustom = require("../../base-service/sequelize/DbServiceSequelize");
const SqlAdapter = require("moleculer-db-adapter-sequelize");


@Service({
	name: serviceName.account,
	mixins: [DBServiceCustom],
	adapter: new SqlAdapter(config.URLPostgres, {
		noSync: true,
	}),
	model: {
		name: serviceName.account,
		define: staffModelSequelize,
	},
	dependencies: ["dbCustomSequelize"],

	collection: serviceName.car,
})
class AccountService extends BaseServiceWithSequelize<Car> {
	@Action()
	public async login(ctx: Context) {
		const params:any = ctx.params
		if(params.user ==  "admin" && params.password == "admin"){
			return jwt.sign({very : "abc"}, "aleTeam")
		}
		else {
			return "Password and user is codsa"
		}
	}
}

module.exports = AccountService;
