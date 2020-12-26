import { Car } from "@Core/base-carOwner/Car";
import { Customer } from "@Core/base-carOwner/Customer";
import { PropsSummary } from "@Core/controller.ts/Statistical";
import { Context } from "moleculer";
import { BaseServiceController } from "./BasesServiceController";

export class CustomerServerController extends BaseServiceController<Customer>{
    constructor(serviceName: string){
        super(serviceName)
    }
    async intervalTotal(ctx: Context, params: PropsSummary): Promise<number> {
        return ctx.broker.call(`${this.serviceName}.intervalTotal`, params);
      }
}