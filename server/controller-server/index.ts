import { serviceName } from "@Core/query/NameService";
import { AccountServerController } from "./AccountServerController";
import { CarServerController } from "./CarServerController";
import { ChairCarServerController } from "./ChairCarServerController";
import { PositionStaffServerController } from "./PositionStaffServerController";
import { StatisticalServerController } from "./StatisticalServerController";
import { TicketServerController } from "./TicketServerController";
import { TripServerController } from "./TripServerController";

export const carControllerServer = new CarServerController(serviceName.car)
export const chairCarControllerServer = new ChairCarServerController(serviceName.chairCar)
export const staffControllerServer = new CarServerController(serviceName.staff)
export const accountControllerServer = new AccountServerController(serviceName.account)
export const customerControllerServer = new AccountServerController(serviceName.customer)
export const positionControllerServer = new PositionStaffServerController(serviceName.position)
export const routeControllerServer = new AccountServerController(serviceName.route)
export const statisticsControllerServer = new StatisticalServerController(serviceName.statistics)
export const tripControllerServer = new TripServerController(serviceName.trip)
export const ticketControllerServer = new TicketServerController(serviceName.ticket)
