import { Car } from "@Core/base-carOwner/Car";
import { PositionStaff } from "@Core/base-carOwner/PositionStaff";
import { BaseServiceController } from "./BasesServiceController";

export class PositionStaffServerController extends BaseServiceController<PositionStaff>{
    constructor(serviceName: string){
        super(serviceName)
    }
}