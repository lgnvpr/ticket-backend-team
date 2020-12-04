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
import { ChartDay, Statistical } from "@Core/controller.ts/Statistical";
const MongoDBAdapter = require("moleculer-db-adapter-mongo");
const DbService = require("moleculer-db");

@Service({
	name: serviceName.car,
	mixins: [DbService],
	adapter: new MongoDBAdapter(config.URLDb),
	collection: serviceName.car,
})
class StatisticalService extends BaseServiceCustom<Car> {
	async Statistical(ctx: Context<any>) {
		var statistic: Statistical = {
			totalCustomer: await ctx.call(`${serviceName.customer}.count`),
			totalRevenue: await ctx.call(`${serviceName.ticket}.totalRevenue`),
			totalTicket: await ctx.call(`${serviceName.ticket}.count`),
			totalTrip: await ctx.call(`${serviceName.trip}.count`),
			charTicket: this.exportDataChar(
				await ctx.call(`${serviceName.ticket}.charTicket`, {
					type: ctx.params.type,
				})
			),
			charRevenue: this.exportDataChar(
				await ctx.call(`${serviceName.ticket}.charRevenue`, {
					type: ctx.params.type,
				})
			),
		};
		return statistic;
	}

	private exportDataChar(data: any, numberLoop: number = 7): any {
		let newData: ChartDay[] = data.map((dataChar) => {
			let date: Date = new Date(
				`${dataChar._id.year}/${dataChar._id.month}/${dataChar._id.day}`
			);
			date = DateHelper.removeToDDMMYYY(date);
			dataChar.day = date;
			delete dataChar._id;
			return dataChar;
		});
		let returnData: ChartDay[] = [];
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
