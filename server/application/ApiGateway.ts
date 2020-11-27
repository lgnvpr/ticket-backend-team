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
          "REST staff": "Staff",
          "REST position": "PositionStaff",
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
