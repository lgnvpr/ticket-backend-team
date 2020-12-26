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
import { SequelizeDbAdapterProps } from "server/base-service/sequelize/SequelizeDbAdapter";
import { PostgresHelper } from "server/helper/PostgresHelper";
const MongoDBAdapter = require("moleculer-db-adapter-mongo");
const DbService = require("moleculer-db");
const DBServiceCustom = require("../../base-service/sequelize/DbServiceSequelize");
const SqlAdapter = require("../../base-service/sequelize/SequelizeDbAdapter");

@Service({
	name: serviceName.car,
	mixins: [DBServiceCustom],
	adapter: new SqlAdapter(carModelSequelize, []),
	dependencies: ["dbCustomSequelize"],

	collection: serviceName.car,
})
class CarService extends BaseServiceWithSequelize<Car> {
	
	@Action()
	public async list(ctx: Context<IList>) {
		ctx.params = this.sanitizeParamsListSequelize(ctx.params)
		ctx.params.searchFields =["name", "description", "origin", "licensePlates", "totalChair"]
		const sql = `select * from cars
		left join (select chair_cars."carId", count(chair_cars."carId") as "totalChair" from chair_cars
		where chair_cars.status  = 'active'
		group by chair_cars."carId"  ) as chair_total
		on (cars.id = chair_total."carId")
		where cars.status = 'active'
		`
		return  PostgresHelper.queryPagination(this.adapter, sql , {}, ctx.params)
		
	}
}

module.exports = CarService;
