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
import { ticketModelSequelize } from "server/model-sequelize/TicketModel";
import { BaseServiceWithSequelize } from "server/base-service/sequelize/BaseServiceWithSequelize";
import { resolveSync } from "tsconfig";
import { PropsSummary } from "@Core/controller.ts/Statistical";
import moment from "moment";
import { started } from "@Applications/ApiGateway";
import { carModelSequelize } from "server/model-sequelize/CarModel";
import { tripModelSequelize } from "server/model-sequelize/TripModel";
import { chairCarModelSequelize } from "server/model-sequelize/ChairCarModel";
import { customerModelSequelize } from "server/model-sequelize/CustomerModel";
const MongoDBAdapter = require("moleculer-db-adapter-mongo");
const DbService = require("moleculer-db");
const DBServiceCustom = require("../../base-service/sequelize/DbServiceSequelize");
const SqlAdapter = require("../../base-service/sequelize/SequelizeDbAdapter");

@Service({
	name: serviceName.ticket,
	mixins: [DBServiceCustom],
	adapter: new SqlAdapter(ticketModelSequelize, [
		tripModelSequelize,
		chairCarModelSequelize,
		customerModelSequelize,
	]),
	dependencies: ["dbCustomSequelize"],

	collection: serviceName.ticket,
})
class TicketService extends BaseServiceWithSequelize<Ticket> {
	@Action()
	public async create(ctx: Context<Ticket>) {
		let params: any = ctx.params;
		let ticket: Ticket = params;
		if (!ticket || !ticket.customer.name || !ticket.customer.phoneNumber)
			throw new Error("Không được để trống thông tin khách hàng");
		let getCustomer = ticket.customer;
		if (getCustomer)
			getCustomer = await ctx.call(
				`${serviceName.customer}.create`,
				getCustomer
			);
		ticket.customerId = getCustomer.id.toString();
		return this._sequelizeCreate(ticket);
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
		const sql = `
			select sum(price) from tickets
			join trips 
			on trips.id = tickets."tripId" 
			group by price 
		`;
		return this.adapter
			.query(sql)
			.then(([[res]]) => parseInt(res["sum"]))
			.catch((err) => 0);
	}

	@Action()
	public async charRevenue(ctx: Context<any>) {
		// let typeGet: any = this.getType(ctx.params.type);
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

		const propsGetChart: PropsSummary = {
			from: new Date(moment(ctx.params.from | 0).format("YYYY-MM-DD")),
			to: new Date(
				moment(ctx.params.to || new Date()).format("YYYY-MM-DD")
			),
			interval: ctx.params.interval || "day",
		};
		propsGetChart.to = new Date(
			propsGetChart.to.setDate(propsGetChart.to.getDate() + 1)
		);

		const sql = `
		select date_trunc(?, tickets."createdAt") as "time",sum(price) as "value" from tickets
		join trips 
		on trips.id = tickets."tripId" 
		where tickets."createdAt" >= ? and tickets."createdAt" <= ? 
		group by date_trunc('day', tickets."createdAt"),price 
		`;
		return this.adapter
			.query(sql, {
				replacements: [
					propsGetChart.interval,
					propsGetChart.from,
					propsGetChart.to,
				],
			})
			.then(([res]: any) => {
				console.log(res);
				return res;
			});
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

		const propsGetChart: PropsSummary = {
			from: new Date(moment(ctx.params.from | 0).format("YYYY-MM-DD")),
			to: new Date(
				moment(ctx.params.to || new Date()).format("YYYY-MM-DD")
			),
			interval: ctx.params.interval || "day",
		};
		propsGetChart.to = new Date(
			propsGetChart.to.setDate(propsGetChart.to.getDate() + 1)
		);

		const sql = `
		select date_trunc(?, tickets."createdAt") as "time",count(*) as "value" from tickets
		where tickets."createdAt" >= ? and tickets."createdAt" <= ? 
		group by date_trunc('day', tickets."createdAt")
		`;
		return this.adapter
			.query(sql, {
				replacements: [
					propsGetChart.interval,
					propsGetChart.from,
					propsGetChart.to,
				],
			})
			.then(([res]: any) => {
				console.log(res);
				return res;
			});
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
