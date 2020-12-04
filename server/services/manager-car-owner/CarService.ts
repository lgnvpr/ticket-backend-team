/* eslint-disable camelcase */
/* eslint-disable max-len */
"use strict";
import { Car, carValidate } from "@Core/base-carOwner/Car";
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
const MongoDBAdapter = require("moleculer-db-adapter-mongo");
const DbService = require("moleculer-db");

@Service({
	name: serviceName.car,
	mixins: [DbService],
	adapter: new MongoDBAdapter(config.URLDb),
	collection: serviceName.car,
})
class CarService extends BaseServiceCustom<Car> {
	@Action()
	public create(ctx: Context<Car>) {
		const car: Car = {
			_id: ctx.params._id,
			entryAt: ctx.params.entryAt,
			licensePlates: ctx.params.licensePlates,
			name: ctx.params.name,
			description: ctx.params.description,
			origin: ctx.params.origin,
		};
		return car;
		// var check = ValidateHelper.validateJoi<Car>(carValidate, car);
		// return check;
		// return this._customCreate(ctx, car);
	}
	@Action()
	public async list(ctx: Context<IList>) {
		var listCar: Paging<Car> = await this._customList(ctx, ctx.params);
		const carIds = listCar.rows.map((car) => car._id);
		const countCharOfCar: {
			_id: string;
			count: number;
		}[] = await ctx.call(`${serviceName.chairCar}.countGroupByCarIds`, {
			id: carIds,
		});

		listCar.rows.map((car) => {
			const getTotalChair = countCharOfCar.find(
				(count) => count._id == car._id
			);
			car.metaMapping = {
				totalChair: getTotalChair?.count,
			};
			return car;
		});
		return listCar;
	}

	@Action()
	public remove(ctx: Context<{ id: string }>) {
		return this._customRemove(ctx, ctx.params);
	}

	@Action()
	public count(ctx: Context) {
		return this._count(ctx, ctx.params);
	}

	@Action()
	public get(ctx: Context<IGet>) {
		return this._customGet(ctx, ctx.params);
	}

	@Action()
	public find(ctx: Context<IFind>) {
		return this._customFind(ctx, ctx.params);
	}
}

module.exports = CarService;
