/* eslint-disable camelcase */
/* eslint-disable max-len */
"use strict";
import MongoBaseService from "@Service/MongoBaseService";
import { Service as MoleculerService, Context } from "moleculer";
import { Action, Method, Service } from "moleculer-decorators";
import {
	PositionDefault,
	PositionStaff,
} from "server/base-ticket-team/base-carOwner/PositionStaff";
import { IList } from "server/base-ticket-team/query/IList";
import { serviceName } from "@Core/query/NameService";
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
	public async create(ctx: Context<PositionStaff>) {
		if (ctx.params._id) {
			const checkDefault = await this._customGet(ctx, {
				id: ctx.params._id,
			});
			if (checkDefault.keyDefault) {
				throw new Error("Không thể sửa nhân viên mặc định");
			}
		}

		return this._customCreate(ctx, ctx.params as PositionStaff);
	}
	@Action()
	public list(ctx: Context<IList>) {
		return this._customList(ctx, ctx.params);
	}

	@Action()
	public async remove(ctx: Context<{ id: string }>) {
		const checkDefault = await this._customGet(ctx, ctx.params);
		if (checkDefault.keyDefault) {
			throw new Error("Không thể xóa nhân viên mặc định");
		}
		return this._customRemove(ctx, ctx.params);
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

	@Action()
	public getDrivers(ctx: Context) {
		return this._customFind(ctx, {
			query: {
				keyDefault: PositionDefault.drive,
			},
		});
	}
}

module.exports = PositionStaffService;
