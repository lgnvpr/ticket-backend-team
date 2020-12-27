import { ChairCar } from "@Core/base-carOwner/ChairCar";
import { Ticket } from "@Core/base-carOwner/Ticket";
import { PropsSummary } from "@Core/controller.ts/Statistical";
import { Context } from "moleculer";
import { BaseServiceController } from "./BasesServiceController";

export class TicketServerController extends BaseServiceController<Ticket> {
	constructor(serviceName: string) {
		super(serviceName);
	}

	async intervalTotal(ctx: Context, params: PropsSummary): Promise<number> {
		return ctx.broker.call(`${this.serviceName}.intervalTotal`, params);
	}

	async totalRevenue(ctx: Context, params: PropsSummary): Promise<number> {
		return ctx.broker.call(`${this.serviceName}.totalRevenue`, params);
	}
}
