/* eslint-disable camelcase */
/* eslint-disable max-len */
"use strict";
import { Ticket } from "@Core/base-carOwner/Ticket";
import { IFind } from "@Core/query/IFind";
import BaseServiceCustom from "@Service/BaseServiceCustom";
import { Service as MoleculerService, Context } from "moleculer";
import { Action, Method, Service } from "moleculer-decorators";
import { Staff } from "server/base-ticket-team/base-carOwner/Staff";
import { IList } from "server/base-ticket-team/query/IList";
import { serviceName } from "@Core/query/NameService";
import config from "server/config";
import { IGet } from "@Core/query/IGet";
import { ticketModelSequelize } from "server/model-sequelize/TicketModel copy";
import { BaseServiceWithSequelize } from "server/base-service/sequelize/BaseServiceWithSequelize";
const MongoDBAdapter = require("moleculer-db-adapter-mongo");
const DbService = require("moleculer-db");
const DBServiceCustom = require("../../base-service/sequelize/DbServiceSequelize");
const SqlAdapter = require("moleculer-db-adapter-sequelize");

@Service({
	name: serviceName.ticket,
	mixins: [DBServiceCustom],
	adapter: new SqlAdapter(config.URLPostgres, {
		noSync: true,
	}),
	model: {
		name: serviceName.ticket,
		define: ticketModelSequelize,
	},
	dependencies: ["dbCustomSequelize"],
	settings: {
		populates: [
			{ field: "trip", service: serviceName.car, filedGet: "positionId" },
			{
				field: "chairCar",
				service: serviceName.car,
				filedGet: "chairCarId",
			},
			{ field: "staff", service: serviceName.car, filedGet: "staffId" },
			{
				field: "customer",
				service: serviceName.car,
				filedGet: "customerId",
			},
		],
	},
	collection: serviceName.ticket,
})
class TicketService extends BaseServiceWithSequelize<Ticket> {
	@Action()
	public async create(ctx: Context<Ticket>) {
		let params: any = ctx.params;
		let ticket: Ticket = params;
		if (
			!ticket ||
			!ticket.metaMapping.customer.name ||
			!ticket.metaMapping.customer.phoneNumber
		)
			throw new Error("Không được để trống thông tin khách hàng");
		let getCustomer = ticket.metaMapping.customer;
		if (getCustomer)
			getCustomer = await ctx.call(
				`${serviceName.customer}.create`,
				getCustomer
			);
		ticket.customerId = getCustomer._id.toString();
		return this._customCreate(ctx, ticket);
	}
	

	@Action()
	public async totalRevenue(ctx: Context) {
		// return this.adapter.collection.aggregate([
		// 	{ $match: {} },
		// 	{
		// 		$lookup: {
		// 			from: "trip",
		// 			localField: "tripId",
		// 			foreignField: "_id",
		// 			as: "trip",
		// 		},
		// 	},
		// 	{ $unwind: "$trip" },
		// 	{ $group: { _id: "trip", totalRevenue: { $sum: "$trip.price" } } },
		// ]).toArray().then(([res])=>{
		// 	return res.totalRevenue
		// })
		
	}

	@Action()
	public async charRevenue(ctx: Context<any>) {
		let typeGet: any = this.getType(ctx.params.type);
		// return this.adapter.collection.aggregate([
		// 	{ $match: {} },
		// 	{
		// 		$lookup: {
		// 			from: "trip",
		// 			localField: "tripId",
		// 			foreignField: "_id",
		// 			as: "Trip",
		// 		},
		// 	},
		// 	{ $unwind: "$Trip" },
		// 	{
		// 		$group: {
		// 			_id: typeGet,
		// 			data: { $sum: "$Trip.price" },
		// 		},
		// 	},
		// ]).toArray();
	}

	@Action()
	public async charTicket(ctx: Context<any>) {
		let typeGet: any = this.getType(ctx.params.type);
		// return this.adapter.collection.aggregate([
		// 	{ $match: {} },
		// 	{
		// 		$group: {
		// 			_id: typeGet,
		// 			data: { $sum: 1 },
		// 		},
		// 	},
		// ]);
	}

	public getType(type: string): any {
		let typeGet: any = {
			year: { $year: "$createAt" },
			month: { $month: "$createAt" },
			day: { $dayOfMonth: "$createAt" },
		};
		if (type == "month") {
			typeGet = {
				year: { $year: "$createAt" },
				month: { $month: "$createAt" },
			};
		}
	}
}

module.exports = TicketService;
