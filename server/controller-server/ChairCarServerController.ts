import { ChairCar } from "@Core/base-carOwner/ChairCar";
import { Context } from "moleculer";
import { BaseServiceController } from "./BasesServiceController";

export class ChairCarServerController extends BaseServiceController<ChairCar>{
    constructor(serviceName: string){
        super(serviceName)
    }
    countGroupByCarIds(ctx: Context,carIds : string[]):Promise<{carId: string, count: number}[]>{
        return ctx.call(`${this.serviceName}.countGroupByCarIds`,{carIds : carIds})
    }
    
}