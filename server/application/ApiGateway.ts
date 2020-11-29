import ApiGateway = require("moleculer-web");
import { ServiceSchema } from "moleculer";

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
          "REST staff": "staff",
          "REST position_staff": "position_staff",
          "REST car": "car",
          "REST chair_car": "chair_car",
          "REST customer": "customer",
          "REST route": "route",
          "REST ticket": "ticket",
          "REST trip": "trip",

          "GET staff/find": "staff.find",
          "GET position_staff/find": "position_staff.find",
          "GET car/find": "car.find",
          "GET chair_car/find": "chair_car.find",
          "GET customer/find": "customer.find",
          "GET route/find": "route.find",
          "GET ticket/find": "ticket.find",
          "GET trip/find": "trip.find",

          "GET staff/count": "staff.count",
          "GET position_staff/count": "position_staff.count",
          "GET car/count": "car.count",
          "GET chair_car/count": "chair_car.count",
          "GET customer/count": "customer.count",
          "GET route/count": "route.count",
          "GET ticket/count": "ticket.count",
          "GET trip/count": "trip.count"


          
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
