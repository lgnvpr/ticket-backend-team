/* eslint-disable camelcase */
/* eslint-disable max-len */
"use strict";
import MongoBaseService from "@Service/MongoBaseService";
import { Service as MoleculerService, Context } from "moleculer";
import { Action, Method, Service } from "moleculer-decorators";
import { PositionStaff } from "server/base-ticket-team/base-carOwner/PositionStaff";
import { IList } from "server/base-ticket-team/query/IList";
import { serviceName } from "server/common/NameService";
import config from "server/config";
const MongoDBAdapter = require("moleculer-db-adapter-mongo");
const DbService = require("moleculer-db");

@Service({
	name: serviceName.position,
	mixins: [DbService],
	adapter: new MongoDBAdapter(config.URLDb),
	settings: {},
	collection: serviceName.position,
})
class PositionStaffService extends MongoBaseService<PositionStaff> {
	@Action()
	public create(ctx: Context) {
		return this._customCreate(ctx, ctx.params as PositionStaff);
	}
	@Action()
	public list(ctx: Context) {
		return this._customList(ctx, ctx.params as IList);
	}

	@Action()
	public remove(ctx: Context) {
		return this._customRemove(ctx, ctx.params as any);
	}

	@Action()
	public count(ctx: Context) {
		return this._count(ctx, ctx.params);
	}

	@Action()
	public async get(ctx: Context<any, any>) {
    return this._customGet(ctx, ctx.params);
	}

	@Action()
	public find(ctx: Context<any, any>) {
		return this._customFind(ctx, ctx.params);
	}
}

module.exports = PositionStaffService;
