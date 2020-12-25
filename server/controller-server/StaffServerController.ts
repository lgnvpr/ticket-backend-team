import { ChairCar } from "@Core/base-carOwner/ChairCar";
import { Staff } from "@Core/base-carOwner/Staff";
import { Context } from "moleculer";
import { BaseServiceController } from "./BasesServiceController";

export class StaffServerController extends BaseServiceController<Staff>{
    constructor(serviceName: string){
        super(serviceName)
    }
}