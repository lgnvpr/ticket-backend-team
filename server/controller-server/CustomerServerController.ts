import { Car } from "@Core/base-carOwner/Car";
import { Customer } from "@Core/base-carOwner/Customer";
import { BaseServiceController } from "./BasesServiceController";

export class CustomerServerController extends BaseServiceController<Customer>{
    constructor(serviceName: string){
        super(serviceName)
    }
}