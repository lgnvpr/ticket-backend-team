/* eslint-disable camelcase */
/* eslint-disable max-len */
"use strict";
import { ChairCar } from "@Core/base-carOwner/ChairCar";
import { IFind } from "@Core/query/IFind";
import MongoBaseService from "@Service/MongoBaseService";
import { Service as MoleculerService, Context } from "moleculer";
import { Action, Method, Service } from "moleculer-decorators";
import { Staff } from "server/base-ticket-team/base-carOwner/Staff";
import { IList } from "server/base-ticket-team/query/IList";
import { serviceName } from "@Core/query/NameService";
import config from "server/config";
const MongoDBAdapter = require("moleculer-db-adapter-mongo");
const DbService = require("moleculer-db");

@Service({
	name: serviceName.chairCar,
	mixins: [DbService],
	adapter: new MongoDBAdapter(config.URLDb),
	settings: {
		populates: [{ field: "car", service: serviceName.car, filedGet : "carId" }],
	},
	collection: serviceName.chairCar,
})
class ChairCarService extends MongoBaseService<ChairCar> {
	@Action()
	public create(ctx: Context<ChairCar>) {
		return this._customCreate(ctx, ctx.params);
	}
	@Action()
	public list(ctx: Context<IList>) {
		return this._customList(ctx, ctx.params);
	}

	@Action()
	public remove(ctx: Context<{id: string}>) {
		return this._customRemove(ctx, ctx.params);
	}

	@Action()
	public count(ctx: Context) {
		return this._count(ctx, ctx.params);
	}

	@Action()
	public get(ctx: Context<{id : string | string[]}>) {
		
		return this._customGet(ctx, ctx.params);
	}

	@Action()
	public find(ctx: Context<IFind> ){
		return this._customFind(ctx, ctx.params)
	}
}

module.exports = ChairCarService;
