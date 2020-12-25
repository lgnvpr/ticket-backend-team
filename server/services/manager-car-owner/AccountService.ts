/* eslint-disable camelcase */
/* eslint-disable max-len */
"use strict";
import { Car } from "@Core/base-carOwner/Car";
import { IFind } from "@Core/query/IFind";
import BaseServiceCustom from "@Service/BaseServiceCustom";
import { Service as MoleculerService, Context } from "moleculer";
import { Action, Method, Service } from "moleculer-decorators";
import { Staff } from "server/base-ticket-team/base-carOwner/Staff";
import { IList } from "server/base-ticket-team/query/IList";
import { serviceName } from "@Core/query/NameService";
import config from "server/config";
import { Paging } from "@Core/query/Paging";
import { IGet } from "@Core/query/IGet";
import { ValidateHelper } from "server/helper/ValidateHelper";
import { carModelSequelize } from "server/model-sequelize/CarModel";
import { BaseServiceWithSequelize } from "server/base-service/sequelize/BaseServiceWithSequelize";
import { ChairCarServerController } from "server/controller-server/ChairCarServerController";
import { accountControllerServer, chairCarControllerServer, staffControllerServer } from "server/controller-server";
import { staffModelSequelize } from "server/model-sequelize/StaffModel";
import jwt from 'jsonwebtoken';
import { accountModelModelSequelize } from "server/model-sequelize/AccountModel";
import { Account } from "@Core/base-carOwner/Account";
const MongoDBAdapter = require("moleculer-db-adapter-mongo");
const DbService = require("moleculer-db");
const DBServiceCustom = require("../../base-service/sequelize/DbServiceSequelize");
const SqlAdapter = require("../../base-service/sequelize/SequelizeDbAdapter");
import md5 from 'md5';
import { Op } from "sequelize";


@Service({
	name: serviceName.account,
	mixins: [DBServiceCustom],
	adapter: new SqlAdapter(accountModelModelSequelize, [staffModelSequelize]),
	dependencies: ["dbCustomSequelize", serviceName.staff],
	collection: serviceName.car,
})
class AccountService extends BaseServiceWithSequelize<Account> {
	@Action()
	public async create(ctx: Context<Account>){
		return this._sequelizeCreate({
			username : ctx.params.username,
			staffId : ctx.params.staffId,
			password : md5(ctx.params.password, "aleTeam")
		})
	}
	
	@Action()
	getMe(ctx: Context<any, any>){
		return ctx.meta.me
	}

	@Action()
	public async login(ctx: Context<{username: string , password : string}>) {
		const params:any = ctx.params;
		const checkExit:any=await this.adapter.model.findOne({
			where: {
				[Op.and] : [
					{username: params.username},
					{password : md5(params.password, "aleTeam")}
				]
			}
		})
		console.log(checkExit)
		const  checkStaff  =await staffControllerServer._get(ctx, {id : checkExit?.dataValues?.staffId})
		if(checkStaff){
			return {
				token : jwt.sign(checkStaff, "aleTeam"),
				auth :checkStaff 
			}
		}
		throw new Error("Tên tài khoản hoặc mật khẩu không đúng");
	}
}

module.exports = AccountService;

