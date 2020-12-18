import { serviceName } from "@Core/query/NameService";
import { CarServerController } from "./CarServerController";
import { ChairCarServerController } from "./ChairCarServerController";

export const carControllerServer = new CarServerController(serviceName.car)
export const chairCarControllerServer = new ChairCarServerController(serviceName.chairCar)