import { ChairCar } from "@Core/base-carOwner/ChairCar";
import { Context } from "moleculer";
import { BaseServiceController } from "./BasesServiceController";
import {Account } from "@Core/base-carOwner/Account"

export class AccountServerController extends BaseServiceController<Account>{
    constructor(serviceName: string){
        super(serviceName)
    }
}