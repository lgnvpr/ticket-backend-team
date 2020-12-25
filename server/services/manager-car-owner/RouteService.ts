/* eslint-disable camelcase */
/* eslint-disable max-len */
"use strict";
import { Route } from "@Core/base-carOwner/Route";
import { IFind } from "@Core/query/IFind";
import BaseServiceCustom from "@Service/BaseServiceCustom";
import { Service as MoleculerService, Context } from "moleculer";
import { Action, Method, Service } from "moleculer-decorators";
import { Staff } from "server/base-ticket-team/base-carOwner/Staff";
import { IList } from "server/base-ticket-team/query/IList";
import { serviceName } from "@Core/query/NameService";
import config from "server/config";
import { IGet } from "@Core/query/IGet";
import { routeModelSequelize } from "server/model-sequelize/RouteModel";
import { BaseServiceWithSequelize } from "server/base-service/sequelize/BaseServiceWithSequelize";
const MongoDBAdapter = require("moleculer-db-adapter-mongo");
const DbService = require("moleculer-db");
const DBServiceCustom = require("../../base-service/sequelize/DbServiceSequelize");
const SqlAdapter = require("../../base-service/sequelize/SequelizeDbAdapter");

@Service({
	name: serviceName.route,
	mixins: [DBServiceCustom],
	adapter: new SqlAdapter(routeModelSequelize, []),
	dependencies: ["dbCustomSequelize"],
	collection: serviceName.route,
})
class RouteService extends BaseServiceWithSequelize<Route> {
	

}

module.exports = RouteService;
