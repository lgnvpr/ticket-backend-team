/* eslint-disable camelcase */
/* eslint-disable max-len */
"use strict";
import { IFind } from "@Core/query/IFind";
import BaseServiceCustom from "@Service/BaseServiceCustom";
import { Service as MoleculerService, Context } from "moleculer";
import { Action, Method, Service } from "moleculer-decorators";
import { Staff } from "server/base-ticket-team/base-carOwner/Staff";
import { IList } from "server/base-ticket-team/query/IList";
import { serviceName } from "@Core/query/NameService";
import config from "server/config";
import { Trip } from "@Core/base-carOwner/Trip";
import { IGetByDate } from "@Core/controller.ts/TripController";
import { Ticket } from "@Core/base-carOwner/Ticket";
import { ChairCar } from "@Core/base-carOwner/ChairCar";
import { DateHelper } from "server/helper/DateHelper";
import { IGet } from "@Core/query/IGet";
import { ListChairCar } from "@Core/controller.ts/ListChairCar";
import { DiagramChairOfTrip } from "@Core/controller.ts/DiagramChairOfTrip";
import { Customer } from "@Core/base-carOwner/Customer";
import { tripModelSequelize } from "server/model-sequelize/TripModel";
import { BaseServiceWithSequelize } from "server/base-service/sequelize/BaseServiceWithSequelize";
const MongoDBAdapter = require("moleculer-db-adapter-mongo");
const DbService = require("moleculer-db");
const DBServiceCustom = require("../../base-service/sequelize/DbServiceSequelize");
const SqlAdapter = require("moleculer-db-adapter-sequelize");

@Service({
	name: serviceName.trip,
	mixins: [DBServiceCustom],
	adapter: new SqlAdapter(config.URLPostgres, {
		noSync: true,
	}),
	model: {
		name: serviceName.trip,
		define: tripModelSequelize,
	},
	dependencies: ["dbCustomSequelize"],
	metadata: {},
	settings: {
		populates: [
			{ field: "drive", service: serviceName.staff, filedGet: "driveId" },
			{ field: "route", service: serviceName.route, filedGet: "routeId" },
			{ field: "car", service: serviceName.car, filedGet: "carId" },
		],
	},
	collection: serviceName.trip,
})
class TripService extends BaseServiceWithSequelize<Trip> {

	@Action()
	getListByDate(ctx: Context<IGetByDate>) {
		var query: IGetByDate = {
			from: new Date(ctx.params.from || new Date()),
			to: new Date(ctx.params.to || new Date()),
		};
		query = {
			from : new Date(new Date(query.from).setDate(query.from.getDate())),
			to : new Date(new Date(query.to).setDate(query.to.getDate()+1)),
		}
		return this._customList(ctx, {
			query: {
				timeStart: {
					$gte: DateHelper.removeToDDMMYYY(query.from),
					$lte: DateHelper.removeToDDMMYYY(query.to),
				},
			},
		});
	}

	@Action()
	getListByCarId(ctx: Context<{ id: string }>) {
		return this._customList(ctx, {
			query: {
				carId: ctx.params.id,
			},
		});
	}

	@Action()
	async getChairByTrip(ctx: Context<{ id: string }>) {
		var trip: Trip = await this._customGet(ctx, { id: ctx.params.id });
		const chairOfCar: ListChairCar = await ctx.call(`${serviceName.chairCar}.getByCarId`, {
			carId: trip.carId,
		});
		
		var getTicket: Ticket[] = await ctx.call(`${serviceName.ticket}.find`, {
			query: {
				tripId: trip._id,
			},
		} as IFind);

		const customerIds = getTicket.map(ticket => ticket.customerId); 
		const getCustomer: Customer[] = await ctx.call(`${serviceName.customer}.get` ,{id : customerIds});
		getTicket = getTicket.map(ticket =>{
			if(Object.entries(ticket.metaMapping || {}).length ==0){
				ticket.metaMapping = {}
			}
			ticket.metaMapping.customer = getCustomer.find(customer =>  customer._id == ticket.customerId)  
			return ticket
		});
		let newDiagramChair = chairOfCar.dataListChar.map((floor: any) => {
			return floor.map((row: any) => {
				return row.map((chair: ChairCar) => {
					let saveColumn: ChairCar = chair;
					if (saveColumn._id) {
						let getTickOfChair: Ticket = getTicket.find(
							(ticket: Ticket) => ticket.chairCarId == saveColumn._id
						);
						if (getTickOfChair) {
							getTickOfChair.metaMapping = {
								...getTickOfChair.metaMapping, 
								chairCar: saveColumn,
								trip: trip,
							};
							return getTickOfChair;
						} else {
							return {
								tripId: trip._id,
								carId: trip?.metaMapping?.car._id,
								chairCarId: saveColumn._id,
								metaMapping: {
									chairCar : saveColumn,
									trip : trip
								},
							} as Ticket;
						}
					} else {
						return {};
					}
				});
			});
		});

	return {
		dataListChair : newDiagramChair
	} as DiagramChairOfTrip
	}

	formatDate(date: Date) : Date{
		var getDate: Date =new Date();
		getDate.setHours(0);
		getDate.setMinutes(0);
		getDate.setSeconds(0);
		getDate.setMilliseconds(0);
		return getDate;
	}
	
}

module.exports = TripService;
