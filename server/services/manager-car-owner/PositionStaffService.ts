/* eslint-disable camelcase */
/* eslint-disable max-len */
"use strict";
import BaseServiceCustom from "@Service/BaseServiceCustom";
import { Service as MoleculerService, Context } from "moleculer";
import { Action, Method, Service } from "moleculer-decorators";
import {
	PositionStaff,
} from "server/base-ticket-team/base-carOwner/PositionStaff";
import { IList } from "server/base-ticket-team/query/IList";
import { serviceName } from "@Core/query/NameService";
import config from "server/config";
import { PositionDefault } from "@Core/base-carOwner/PositionDefault";
import { positionStaffModelSequelize } from "server/model-sequelize/PositionStaffModel";
import { BaseServiceWithSequelize } from "server/base-service/sequelize/BaseServiceWithSequelize";
const MongoDBAdapter = require("moleculer-db-adapter-mongo");
const DbService = require("moleculer-db");
const DBServiceCustom = require("../../base-service/sequelize/DbServiceSequelize");
const SqlAdapter = require("../../base-service/sequelize/SequelizeDbAdapter");

@Service({
	name: serviceName.position,
	mixins: [DBServiceCustom],
	adapter: new SqlAdapter(positionStaffModelSequelize, []),
	dependencies: ["dbCustomSequelize"],
	settings: {},
	collection: serviceName.position,
})
class PositionStaffService extends BaseServiceWithSequelize<PositionStaff> {
	// @Action()
	// public async create(ctx: Context<PositionStaff>) {
	// 	if (ctx.params._id) {
	// 		const checkDefault = await this._customGet(ctx, {
	// 			id: ctx.params._id,
	// 		});
	// 		// if (checkDefault?.keyDefault) {
	// 		// 	throw new Error("Không thể sửa nhân viên mặc định");
	// 		// }
	// 	}

	// 	return this._customCreate(ctx, ctx.params as PositionStaff);
	// }
	

	// @Action()
	// public async remove(ctx: Context<{ id: string }>) {
	// 	const checkDefault = await this._customGet(ctx, ctx.params);
	// 	if (checkDefault.keyDefault) {
	// 		throw new Error("Không thể xóa nhân viên mặc định");
	// 	}
	// 	return this._customRemove(ctx, ctx.params);
	// }

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
