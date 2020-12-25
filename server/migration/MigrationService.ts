/* eslint-disable camelcase */
/* eslint-disable max-len */
"use strict";
import { Trip } from "@Core/base-carOwner/Trip";
import { serviceName } from "@Core/query/NameService";
import { Context } from "moleculer";
import { Action, Service } from "moleculer-decorators";
import { BaseServiceWithSequelize } from "server/base-service/sequelize/BaseServiceWithSequelize";
import { accountControllerServer, carControllerServer, chairCarControllerServer, customerControllerServer, positionControllerServer, routeControllerServer, staffControllerServer, ticketControllerServer, tripControllerServer } from "server/controller-server";
import { dataCustomer } from "server/migration/data/CustomerData";
import faker from 'faker';
import { dataPosition } from "./data/PositionData";
import { dataCar } from "./data/CarData";
import { dataStaff } from "./data/StaffData";
import { dataRoute } from "./data/RouteData";
import { TicketServerController } from "server/controller-server/TicketServerController";
import { Customer } from "@Core/base-carOwner/Customer";
import { ChairCar } from "@Core/base-carOwner/ChairCar";


@Service({
	name: "Migration",
	dependencies: [
		"dbCustomSequelize",
		serviceName.account,
		serviceName.car,
		serviceName.chairCar,
		serviceName.customer,
		serviceName.position,
		serviceName.route,
		serviceName.staff,
		serviceName.ticket,
		serviceName.trip,
	],
})
class TripService extends BaseServiceWithSequelize<Trip> {
	@Action()
	public async migration(ctx: Context) {
		for await (const item of dataCustomer) {
			item.birthAt = new Date(item.birthAt) as any
			item.avt = faker.image.avatar()
			await customerControllerServer._create(ctx, item as any)
		}

		for await (const item of dataPosition) {
			await positionControllerServer._create(ctx, item as any)
		}

		for await (const item of dataCar) {
			await carControllerServer._create(ctx, item as any)
		}

		const carFind = await carControllerServer._find(ctx,{})
		for await (const item of carFind){
			await chairCarControllerServer.autoCreateChair(ctx, {
				carId : item.id,
				column :4,
				floor : 1,
				row : 10
			})
		}

		const positionFind =await positionControllerServer._find(ctx, {})
		for await (const item of dataStaff) {
			item.positionId = await positionFind[Math.floor(Math.random()*((await positionFind).length-1))].id
			await staffControllerServer._create(ctx, item as any)
		}

		for await (const item of dataRoute) {
			await routeControllerServer._create(ctx, item as any)
		}

		const routeFind = await routeControllerServer._find(ctx, {});
		const staffFind = await staffControllerServer._find(ctx, {});

		for await (const item of carFind) {
			let date = new Date();
			date.setDate(date.getDate()+ Math.floor(Math.random()*30))
			await tripControllerServer._create(ctx, {
				carId : item.id,
				driveId : staffFind[Math.floor(Math.random()*((await positionFind).length-1))].id,
				routeId : routeFind[Math.floor(Math.random()*((await positionFind).length-1))].id,
				timeStart : new Date(date),
				price : Math.floor(Math.random()*200 +100)*1000,
			})
			await tripControllerServer._create(ctx, {
				carId : item.id,
				driveId : staffFind[Math.floor(Math.random()*((await positionFind).length-1))].id,
				routeId : routeFind[Math.floor(Math.random()*((await positionFind).length-1))].id,
				timeStart : new Date(date),
				price : Math.floor(Math.random()*200 +100)*1000,
			})
		}

		const tripFind: Trip[] = await tripControllerServer._find(ctx, {})
		const customerFind :Customer[] = await customerControllerServer._find(ctx, {})
		const chairCarFind : ChairCar[] = await chairCarControllerServer._find(ctx, {})
		

		for await (const item of tripFind) {
			const tripTicket = item;
			const routerTicket = routeFind.find(route => route.id == item.routeId )
			const chairTicket = chairCarFind.filter(chair=>{
				return item.carId == chair.carId
			})
			console.log("chaircarfind", chairCarFind)
			for (let i = 0; i < chairTicket.length; i++) {
				const customerTicket = customerFind[Math.floor(Math.random()*((await positionFind).length-1))]
				let date = new Date();
			date.setDate(date.getDate()+ Math.floor(Math.random()*30))
				await ticketControllerServer._create(ctx, {
					chairCarId : chairTicket[i].id,
					customerId : customerTicket.id,
					localDrop : routerTicket.localEnd,
					localPickup : routerTicket.localStart,
					description : "",
					tripId : tripTicket.id,
					customer : customerTicket,
					createdAt : date
				})	
			}
		}

		await accountControllerServer._create(ctx, {
			staffId : staffFind[Math.floor(Math.random()*((await positionFind).length-1))].id,
			username : "lgnvpr@gmail.com",
			password : "admin"
		})

		await accountControllerServer._create(ctx, {
			staffId : staffFind[Math.floor(Math.random()*((await positionFind).length-1))].id,
			username : "kim@gmail.com",
			password : "admin"
		})

		await accountControllerServer._create(ctx, {
			staffId : staffFind[Math.floor(Math.random()*((await positionFind).length-1))].id,
			username : "quuyet@gmail.com",
			password : "admin"
		})
		await accountControllerServer._create(ctx, {
			staffId : staffFind[Math.floor(Math.random()*((await positionFind).length-1))].id,
			username : "hieu@gmail.com",
			password : "admin"
		})
		await accountControllerServer._create(ctx, {
			staffId : staffFind[Math.floor(Math.random()*((await positionFind).length-1))].id,
			username : "hung@gmail.com",
			password : "admin"
		})

	}

	started() {
		this.actions.migration();
	}
}

module.exports = TripService;
