/* eslint-disable camelcase */
/* eslint-disable max-len */
"use strict";
import { Staff } from "@Core/base-ticket-team/base-carOwner/Staff";
import { IList } from "@Core/base-ticket-team/query/IList";
import MongoBaseService from "@Service/MongoBaseService";
import { Service as MoleculerService, Context } from "moleculer";
import { Action, Method, Service } from "moleculer-decorators";
import config from "server/config";
const MongoDBAdapter = require("moleculer-db-adapter-mongo");
const DbService = require("moleculer-db");

@Service({
	name: "staff",
	mixins: [DbService],
	adapter: new MongoDBAdapter(config.URLDb),
	metadata: {
		populates: [{ field: "position", service: "PostionStaff", filedGet : "positionId" }],
	},
	collection: "Staff",
})
class StaffService extends MongoBaseService<Staff> {
	@Action()
	public create(ctx: Context) {
		return this._customCreate(ctx, ctx.params as Staff);
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
	public getById(ctx: Context<any, any>) {
		return this._customGet(ctx, ctx.params);
	}

	@Action()
	public get(ctx: Context<any, any>) {
		
		return this._customGet(ctx, ctx.params);
	}
}

module.exports = StaffService;
