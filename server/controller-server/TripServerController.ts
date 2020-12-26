import { ChairCar } from "@Core/base-carOwner/ChairCar";
import { Trip } from "@Core/base-carOwner/Trip";
import { PropsSummary } from "@Core/controller.ts/Statistical";
import { Context } from "moleculer";
import { carControllerServer, routeControllerServer } from ".";
import { BaseServiceController } from "./BasesServiceController";

export class TripServerController extends BaseServiceController<Trip>{
    constructor(serviceName: string){
        super(serviceName)
    }

    async autoMapping(ctx: Context, data: Trip[]) : Promise<Trip[]>{
        const carIds =await data.map(item => item.carId);
        const carMapping =await carControllerServer._find(ctx,{
            query : {id : carIds}
        } );
        const routeIds = data.map(item=> item.routeId)
        const routeMapping = await routeControllerServer._find(ctx, {
            query : {id : routeIds}
        });

        data = data.map(item=>{
            item.route = routeMapping.find(route => route.id === item.routeId);
            item.car = carMapping.find(car => car.id === item.carId)
            return item;
        })
        return data;
    }
    async intervalTotal(ctx: Context, params: PropsSummary): Promise<number> {
        return ctx.broker.call(`${this.serviceName}.intervalTotal`, params);
      }
}