import { ChairCar } from "@Core/base-carOwner/ChairCar";
import { Ticket } from "@Core/base-carOwner/Ticket";
import { Context } from "moleculer";
import { BaseServiceController } from "./BasesServiceController";

export class TicketServerController extends BaseServiceController<Ticket>{
    constructor(serviceName: string){
        super(serviceName)
    }
}