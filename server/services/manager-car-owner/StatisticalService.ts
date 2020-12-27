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
import { IntervalTicketChart, PropsSummary, Summary } from "@Core/controller.ts/Statistical";
import { ticketModelSequelize } from "server/model-sequelize/TicketModel";
import { BaseServiceWithSequelize } from "server/base-service/sequelize/BaseServiceWithSequelize";
import moment from "moment";
import { customerControllerServer, ticketControllerServer, tripControllerServer } from "server/controller-server";
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
		const data = this.exportDataChar(
			await ctx.call(`${serviceName.ticket}.charTicket`, {
				from: ctx.params.from,
				to: ctx.params.to,
				interval: ctx.params.interval,
			}),
			"day", ctx.params.from , ctx.params.to
		);
		return data;
	}

	@Action()
	async IntervalRevenue(ctx: Context<any>) {
	
		return this.exportDataChar(
			await ctx.call(`${serviceName.ticket}.charRevenue`, {
				from: ctx.params.from,
				to: ctx.params.to,
				interval: ctx.params.interval,
			}),
			"day", ctx.params.from , ctx.params.to
		);
	}

	@Action()
	async StatisticalSummary(ctx: Context<PropsSummary>) {
		ctx.params.from = new Date(moment(new Date(ctx.params.from || 0)).format("YYYY-MM-DD"))
		ctx.params.to = new Date(moment(new Date(ctx.params.to || new Date())).format("YYYY-MM-DD"));
		ctx.params.to.setDate(ctx.params.to.getDate() +1)

		var statistic: Summary = {
			totalCustomer: await customerControllerServer.intervalTotal(ctx,ctx.params ),
			totalRevenue: await ticketControllerServer.totalRevenue(ctx,ctx.params ),
			totalTicket: await ticketControllerServer.intervalTotal(ctx,ctx.params ),
			totalTrip: await tripControllerServer.intervalTotal(ctx,ctx.params ),
		};
		return statistic;
	}

	private exportDataChar(
		data: { time: Date; value: number }[],
		interval: "day" | "month", from , to
	): IntervalTicketChart[] {
		data = data.map((item) => {
			return {
				time: new Date(item.time),
				value: parseInt(item.value.toString()),
			};
		});
		const dates = data.map((item) => {
			return item.time;
		});
		var maxDate = this.findMaxDate(dates);
		var minDate = this.findMinDate(dates);
		if(from){
			minDate = new Date(moment(from).format("YYYY-MM-DD"))
		}
		if(to){
			maxDate =new Date(moment(to).format("YYYY-MM-DD"))
		}
		
		
		const getRange = maxDate.getTime() - minDate.getTime();
		if (interval == "month") {
			return "Tao chưa viết cho tháng , truyền ngày hộ phát .......ok" as any;
		} else {
			return this.renderChartByDate(data, getRange, minDate, maxDate);
		}
		//tìm theo ngày

	}

	san
	private renderChartByDate(
		data: { time: Date; value: number }[],
		range: number,
		minDate: Date,
		maxDate: Date
	): IntervalTicketChart[] {
		const calcRange = range / (1000 * 60 * 60 * 24) + 1;

		var dataReturn: IntervalTicketChart[] = [];
		for (let i = 0; i < calcRange; i++) {
			const saveDate = new Date(minDate);
			const dateCheck = new Date(
				saveDate.setDate(saveDate.getDate() + i)
			);
			const dataCheck = data.find((item) => {
				return item.time.getTime() == dateCheck.getTime();
			});
			dataReturn.push({
				data: dataCheck?.value || 0,
				day: dateCheck,
			});
		}
		return dataReturn;
	}

	private findMinDate(time: Date[]): Date {
		return time.reduce((pre, next) => {
			if (pre.getTime() > next.getTime()) {
				return next;
			}
			return pre;
		}, time[0]);
	}
	private findMaxDate(time: Date[]): Date {
		return time.reduce((pre, next) => {
			if (pre.getTime() < next.getTime()) {
				return next;
			}
			return pre;
		}, time[0]);
	}
}

module.exports = StatisticalService;
