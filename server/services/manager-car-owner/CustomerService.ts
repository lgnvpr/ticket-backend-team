/* eslint-disable camelcase */
/* eslint-disable max-len */
"use strict";
import { Customer } from "@Core/base-carOwner/Customer";
import { IFind } from "@Core/query/IFind";
import BaseServiceCustom from "@Service/BaseServiceCustom";
import { Service as MoleculerService, Context } from "moleculer";
import { Action, Method, Service } from "moleculer-decorators";
import { Staff } from "server/base-ticket-team/base-carOwner/Staff";
import { IList } from "server/base-ticket-team/query/IList";
import { serviceName } from "@Core/query/NameService";
import config from "server/config";
import { IGet } from "@Core/query/IGet";
import { customerModelSequelize } from "server/model-sequelize/CustomerModel";
import { BaseServiceWithSequelize } from "server/base-service/sequelize/BaseServiceWithSequelize";
import { PropsSummary } from "@Core/controller.ts/Statistical";
const MongoDBAdapter = require("moleculer-db-adapter-mongo");
const DbService = require("moleculer-db");
const DBServiceCustom = require("../../base-service/sequelize/DbServiceSequelize");
const SqlAdapter = require("../../base-service/sequelize/SequelizeDbAdapter");

@Service({
	name: serviceName.customer,
	mixins: [DBServiceCustom],
	adapter: new SqlAdapter(customerModelSequelize, []),
	dependencies: ["dbCustomSequelize"],
	collection: serviceName.customer,
})
class CustomerService extends BaseServiceWithSequelize<Customer> {
	@Action()
	public list(ctx: Context<IList>) {
		ctx.params.searchFields = ["CMND","email","name","phoneNumber","sex","description"];
		return  this._sequelizeList(ctx.params)
	}

	@Action()
	public intervalTotal(ctx: Context<PropsSummary>){
		const sql = `select count(*) from customers 
		where customers.status = 'active'
		and customers."createdAt" >= :from and customers."createdAt" <= :to
		`
		return this.adapter.db.query(sql , {replacements: {
			from : ctx.params.from,
			to : ctx.params.to  
		}}).then(([[res]] : any)=>{
			return res.count
		})
	}
}

module.exports = CustomerService;
