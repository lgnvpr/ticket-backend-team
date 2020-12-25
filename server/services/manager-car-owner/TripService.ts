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
import { ListWithTripSale } from "@Core/controller.ts/TripController";
import { Status } from "@Core/query/BaseModel";
import { IFind } from "@Core/query/IFind";
import { serviceName } from "@Core/query/NameService";
import { Context } from "moleculer";
import { Action, Service } from "moleculer-decorators";
import moment from "moment";
import { Op, where } from "sequelize";
import { BaseServiceWithSequelize } from "server/base-service/sequelize/BaseServiceWithSequelize";
import { tripControllerServer } from "server/controller-server";
import { PostgresHelper } from "server/helper/PostgresHelper";
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
	dependencies: ["dbCustomSequelize", serviceName.car, serviceName.route],
	collection: serviceName.trip,
})
class TripService extends BaseServiceWithSequelize<Trip> {
	@Action()
	async getListByDate(ctx: Context<ListWithTripSale>) {
		console.log(ctx.params)
		var from = new Date(moment(ctx.params.from || new Date()).format("YYYY-MM-DD"))
		var to = new Date(moment(ctx.params.to || new Date()).format("YYYY-MM-DD"));
		to.setDate(to.getDate()+1)
		ctx.params = this.sanitizeParamsListSequelize(ctx.params)
		ctx.params.searchFields = ["totalChairRemain", "totalChair","price",  "nameCar", "localEnd", "localStart"]
		var sql = `
		select trip_data.*,chair_car_data."totalChair",chair_remain."totalChairRemain"
		from (select trips.*, routes."sumTimeRun", routes."localStart" as "localStart",routes."localEnd" as "localEnd", cars.name as "nameCar"   from trips 
		join routes
		on (routes."id" = trips."routeId" and routes."status" = 'active')
		join cars 
		on (cars.id = trips."carId" and cars."status" = 'active' )
		where trips."timeStart" >= :from and trips."timeStart" <= :to
		) as trip_data
		join
		(select chair_cars."carId", count(chair_cars."carId") as "totalChair" from chair_cars 
		group by chair_cars."carId"
		) as chair_car_data
		on chair_car_data."carId" = trip_data."carId"
		left join (
			select trips.id, count(trips.id) as "totalChairRemain" from tickets
		join trips 
		on trips.id = tickets."tripId"
		where tickets."chairCarId" in (
			select chair_cars.id from chair_cars
			where chair_cars."carId" = trips."carId"
		)
		group by trips.id
		) chair_remain
		on chair_remain.id = trip_data.id

		`
		const tripPagination = await PostgresHelper.queryPagination(this.adapter, sql , {
			from : from, 
			to : to
		}, ctx.params)
		tripPagination.rows =await tripControllerServer.autoMapping(ctx, tripPagination.rows)
		return 	tripPagination
	}

	@Action()
	getListByCarId(ctx: Context<{ id: string }>) {
		return this._sequelizeFind({
			query: {
				carId: ctx.params.id,
			},
		});
	}

	@Action()
	async getChairByTrip(ctx: Context<{ id: string }>) {
		var trip: Trip = await this._sequelizeGet({id : ctx.params.id});
		console.log(trip)
		const chairOfCar: ListChairCar = await ctx.call(`${serviceName.chairCar}.getByCarId`, {
			carId: trip.carId,
		});
		console.log(chairOfCar)
		
		var getTicket: Ticket[] = await ctx.call(`${serviceName.ticket}.find`, {
			query: {
				tripId: ctx.params.id,
			},
		} as IFind);

		const customerIds = getTicket.map(ticket => ticket.customerId); 
		const getCustomer: Customer[] = await ctx.call(`${serviceName.customer}.find` ,{id : customerIds});
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

	
	
}

module.exports = TripService;
