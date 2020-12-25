import { Car } from "@Core/base-carOwner/Car";
import { Route } from "@Core/base-carOwner/Route";
import { BaseServiceController } from "./BasesServiceController";

export class RouteServerController extends BaseServiceController<Route>{
    constructor(serviceName: string){
        super(serviceName)
    }
}