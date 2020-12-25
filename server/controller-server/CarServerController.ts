import { Car } from "@Core/base-carOwner/Car";
import { BaseServiceController } from "./BasesServiceController";

export class CarServerController extends BaseServiceController<Car>{
    constructor(serviceName: string){
        super(serviceName)
    }
}