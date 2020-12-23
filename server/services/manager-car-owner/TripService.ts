/* eslint-disable camelcase */
/* eslint-disable max-len */
"use strict";
import config from "@Config/index";
import { ChairCar } from "@Core/base-carOwner/ChairCar";
import { Customer } from "@Core/base-carOwner/Customer";
import { Ticket } from "@Core/base-carOwner/Ticket";
import { Trip } from "@Core/base-carOwner/Trip";
import { DiagramChairOfTrip } from "@Core/controller.ts/DiagramChairOfTrip";
import { ListChairCar } from "@Core/controller.ts/ListChairCar";
import { IGetByDate } from "@Core/controller.ts/TripController";
import { IFind } from "@Core/query/IFind";
import { serviceName } from "@Core/query/NameService";
import { Context } from "moleculer";
import { Action, Service } from "moleculer-decorators";
import { Op } from "sequelize";
import { BaseServiceWithSequelize } from "server/base-service/sequelize/BaseServiceWithSequelize";
import { carModelSequelize } from "server/model-sequelize/CarModel";
import { routeModelSequelize } from "server/model-sequelize/RouteModel";
import { ticketModelSequelize } from "server/model-sequelize/TicketModel";
import { tripModelSequelize } from "server/model-sequelize/TripModel";
const DBServiceCustom = require("../../base-service/sequelize/DbServiceSequelize");
const Adapter = require("../../base-service/sequelize/SequelizeDbAdapter");

@Service({
	name: serviceName.trip,
	adapter: new Adapter(tripModelSequelize, [carModelSequelize, routeModelSequelize]),
	mixins: [DBServiceCustom],
	dependencies: ["dbCustomSequelize"],
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
		return this.adapter.model.findAndCountAll({
			where : {
				[Op.and]: [
					{}
				]
			},
			limit : 10,
			offset : 0 
		}).then(res=>{
			 (res)
			return res
		})
		
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
		var trip: Trip = await this._get(ctx, { id: ctx.params.id });
		const chairOfCar: ListChairCar = await ctx.call(`${serviceName.chairCar}.getByCarId`, {
			carId: trip.carId,
		});
		
		var getTicket: Ticket[] = await ctx.call(`${serviceName.ticket}.find`, {
			query: {
				tripId: trip.id,
			},
		} as IFind);

		const customerIds = getTicket.map(ticket => ticket.customerId); 
		const getCustomer: Customer[] = await ctx.call(`${serviceName.customer}.get` ,{id : customerIds});
		getTicket = getTicket.map(ticket =>{
			ticket.customer = getCustomer.find(customer =>  customer.id == ticket.customerId)  
			return ticket
		});
		let newDiagramChair = chairOfCar.dataListChar.map((floor: any) => {
			return floor.map((row: any) => {
				return row.map((chair: ChairCar) => {
					let saveColumn: ChairCar = chair;
					if (saveColumn.id) {
						let getTickOfChair: Ticket = getTicket.find(
							(ticket: Ticket) => ticket.chairCarId == saveColumn.id
						);
						if (getTickOfChair) {
							getTickOfChair = {
								...getTickOfChair, 
								chair_car: saveColumn,
								trip: trip,
							};
							return getTickOfChair;
						} else {
							return {
								tripId: trip.id,
								carId: trip?.car?.id,
								chairCarId: saveColumn.id,
								chairCar : saveColumn,
								trip : trip
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
