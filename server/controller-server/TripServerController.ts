import { ChairCar } from "@Core/base-carOwner/ChairCar";
import { Trip } from "@Core/base-carOwner/Trip";
import { Context } from "moleculer";
import { BaseServiceController } from "./BasesServiceController";

export class TripServerController extends BaseServiceController<Trip>{
    constructor(serviceName: string){
        super(serviceName)
    }
}