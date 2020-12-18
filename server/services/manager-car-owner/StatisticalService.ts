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
import { DateHelper } from "server/helper/DateHelper";
import { IntervalTicketChart, Summary } from "@Core/controller.ts/Statistical";
import { ticketModelSequelize } from "server/model-sequelize/TicketModel copy";
import { BaseServiceWithSequelize } from "server/base-service/sequelize/BaseServiceWithSequelize";
const MongoDBAdapter = require("moleculer-db-adapter-mongo");
const DbService = require("moleculer-db");
const DBServiceCustom = require("../../base-service/sequelize/DbServiceSequelize");
const SqlAdapter = require("moleculer-db-adapter-sequelize");

@Service({
	name: serviceName.statistics,
	mixins: [DBServiceCustom],
	
	dependencies: ["dbCustomSequelize"],
	collection: serviceName.statistics,
})
class StatisticalService extends BaseServiceWithSequelize<Car> {
	@Action()
	async IntervalTicket(ctx: Context<any>) {
		const data =  this.exportDataChar(
			await ctx.call(`${serviceName.ticket}.charTicket`, {
				type: ctx.params.type,
			})
		)

		return data 
	}

	@Action()
	async IntervalRevenue(ctx: Context<any>) {
		return this.exportDataChar(
			await ctx.call(`${serviceName.ticket}.charRevenue`, {
				type: ctx.params.type,
			})
		)
	}

	@Action()
	async StatisticalSummary(ctx: Context<any>) {
		var statistic: Summary = {
			totalCustomer: await ctx.call(`${serviceName.customer}.count`),
			totalRevenue: await ctx.call(`${serviceName.ticket}.totalRevenue`),
			totalTicket: await ctx.call(`${serviceName.ticket}.count`),
			totalTrip: await ctx.call(`${serviceName.trip}.count`),
		};
		return statistic;
	}

	private exportDataChar(data: any, numberLoop: number = 7): any {
		let newData: IntervalTicketChart[] = data.map((dataChar) => {
			let date: Date = new Date(
				`${dataChar._id.year}/${dataChar._id.month}/${dataChar._id.day}`
			);
			date = DateHelper.removeToDDMMYYY(date);
			dataChar.day = date;
			delete dataChar._id;
			return dataChar;
		});
		let returnData: IntervalTicketChart[] = [];
		for (let i = 0; i < numberLoop; i++) {
			let dateNeedRender: Date = DateHelper.removeToDDMMYYY(new Date());
			dateNeedRender.setDate(dateNeedRender.getDate() - i);
			let getData = newData.find(
				(dataItem) =>
					dataItem.day.getTime() === dateNeedRender.getTime()
			);
			returnData.push(getData || { data: 0, day: dateNeedRender });
		}
		return returnData.reverse();
		//tìm theo ngày
	}
}

module.exports = StatisticalService;
