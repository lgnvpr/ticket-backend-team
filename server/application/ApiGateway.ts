import ApiGateway = require("moleculer-web");
import { ServiceSchema } from "moleculer";
import { serviceName } from "@Core/query/NameService";

const ApiService: ServiceSchema = {
  name: "ApiGateway",

  mixins: [ApiGateway],

  settings: {
    port: process.env.PORT || 3001,
    use: [
      (req: Request, res: any, next) => {
        res.$service.logger.info(
          `[HTTP REQUEST] uri [${req.url}] method [${
            req.method
          }] body [${JSON.stringify(req.body)}] and res is [${res.body}]`
        );
        next();
      },
    ],
    cors: {
        // Configures the Access-Control-Allow-Origin CORS header.
        origin: "*",
        // Configures the Access-Control-Allow-Methods CORS header. 
        methods: ["GET", "OPTIONS", "POST", "PUT", "DELETE"],
        // Configures the Access-Control-Allow-Headers CORS header.
        allowedHeaders: "*",
        // Configures the Access-Control-Expose-Headers CORS header.
        exposedHeaders: "*",
        // Configures the Access-Control-Allow-Credentials CORS header.
        credentials: false,
        // Configures the Access-Control-Max-Age CORS header.
        maxAge: 3600,
    },
    routes: [
      {
        aliases: {
          
          // additional treatment resource
          "REST staff": serviceName.staff,
          "REST position_staff": serviceName.position,
          "REST car": serviceName.car,
          "REST chair_car": serviceName.chairCar,
          "REST customer": serviceName.customer,
          "REST route": serviceName.route,
          "REST ticket": serviceName.ticket,
          "REST trip": serviceName.trip,

          "GET staff/find": `${serviceName.staff}.find`,
          "GET position_staff/find": `${serviceName.position}.find`,
          "GET car/find": `${serviceName.car}.find`,
          "GET chair_car/find": `${serviceName.chairCar}.find`,
          "GET customer/find": `${serviceName.customer}.find`,
          "GET route/find": `${serviceName.route}.find`,
          "GET ticket/find": `${serviceName.ticket}.find`,
          "GET trip/find": `${serviceName.trip}.find`,

          "GET staff/count": `${serviceName.staff}.count`,
          "GET position_staff/count": `${serviceName.position}.count`,
          "GET car/count": `${serviceName.car}.count`,
          "GET chair_car/count": `${serviceName.chairCar}.count`,
          "GET customer/count": `${serviceName.customer}.count`,
          "GET route/count": `${serviceName.route}.count`,
          "GET ticket/count": `${serviceName.ticket}.count`,
          "GET trip/count": `${serviceName.trip}.count`,

          "GET chair_car/byCar/:carId" : `${serviceName.chairCar}.getByCarId`,
          "GET chair_car/autoCreateChair" : `${serviceName.chairCar}.autoCreateChair`,
          "GET chair_car/countGroupByCarIds" : `${serviceName.chairCar}.countGroupByCarIds`,
          "GET chair_car/getDrivers" : `${serviceName.position}.getDrivers`,

          "GET trip/getListByDate" : `${serviceName.trip}.getListByDate`,
          "GET trip/getChairByTrip/:id" : `${serviceName.trip}.getChairByTrip`,

          "GET statistics/IntervalRevenue" : `${serviceName.statistics}.IntervalRevenue`,
          "GET statistics/IntervalTicket" : `${serviceName.statistics}.IntervalTicket`,
          "GET statistics/StatisticalSummary" : `${serviceName.statistics}.StatisticalSummary`,
          

          


          
        },
      },
    ],
    assets: {
      folder: "public",
    },
  },
  actions: {},
  methods: {},
};

export = ApiService;
