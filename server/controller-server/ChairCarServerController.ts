import { ChairCar } from "@Core/base-carOwner/ChairCar";
import { CreateChairCar } from "@Core/controller.ts/CreateChairCar";
import { Context } from "moleculer";
import { BaseServiceController } from "./BasesServiceController";

export class ChairCarServerController extends BaseServiceController<ChairCar>{
    constructor(serviceName: string){
        super(serviceName)
    }
    countGroupByCarIds(ctx: Context,carIds : string[]):Promise<{carId: string, count: number}[]>{
        return ctx.call(`${this.serviceName}.countGroupByCarIds`,{carIds : carIds})
    }
    autoCreateChair(ctx: Context, params : CreateChairCar): Promise<ChairCar[]>{
        return ctx.call(`${this.serviceName}.autoCreateChair`,params)
    }
    
}