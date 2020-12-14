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
const MongoDBAdapter = require("moleculer-db-adapter-mongo");
const DbService = require("moleculer-db");

@Service({
	name: serviceName.trip,
	mixins: [DbService],
	adapter: new MongoDBAdapter(config.URLDb),
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
class TripService extends BaseServiceCustom<Trip> {
	@Action()
	public create(ctx: Context<Trip>) {
		const trip: Trip = {
			carId: ctx.params.carId,
			_id: ctx.params._id,
			price: ctx.params.price,
			driveId: ctx.params.driveId,
			routeId: ctx.params.routeId,
			timeStart: new Date(ctx.params.timeStart) || new Date(),
		};
		return this._customCreate(ctx, trip);
	}
	@Action()
	public async list(ctx: Context<IList>) {
		return this._customList(ctx, ctx.params);
	}

	@Action()
	public remove(ctx: Context<{ id: string }>) {
		return this._customRemove(ctx, ctx.params);
	}

	@Action()
	public count(ctx: Context) {
		return this._count(ctx, ctx.params);
	}

	@Action()
	public get(ctx: Context<IGet>) {
		return this._customGet(ctx, ctx.params);
	}

	@Action()
	public find(ctx: Context<IFind>) {
		return this._customFind(ctx, ctx.params);
	}

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
		
	console.table(trip);
		console.table(chairOfCar);
		const getTicket: [] = await ctx.call(`${serviceName.ticket}.find`, {
			query: {
				tripId: trip._id,
			},
		} as IFind);


		let newDiagramChair = chairOfCar.dataListChar.map((floor: any) => {
			return floor.map((row: any) => {
				return row.map((chair: ChairCar) => {
					let saveColumn: ChairCar = chair;
					if (saveColumn._id) {
						let getTickOfChair: Ticket = getTicket.find(
							(tick: Ticket) => tick._id == saveColumn._id
						);
						if (getTickOfChair) {
							getTickOfChair.metaMapping = {
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
