"use strict";
const { ServiceSchemaError } = require("moleculer").Errors;
const Sequelize = require("sequelize");
import _ from "lodash";
import {
	ModelCtor,
	Model as ModelSequelize,
	Sequelize as SequelizeModel,
} from "sequelize/types";
import { ServiceBroker, Service as MoleculerService } from "moleculer";
const { Model, Op } = Sequelize;
import { v4 as uuidv4 } from "uuid";
import { BaseModel, Status } from "@Core/query/BaseModel";
import { sequelizeConnect } from "server/model-sequelize";
const sequelizeRelations = require("../../helper/RelationAdapter");

 class SequelizeDbAdapter<T extends BaseModel> {
	opts: any;
	broker: ServiceBroker;
	service: MoleculerService;
	db: SequelizeModel;
	model: ModelCtor<Result<T>>;
	relations: ModelCtor<Result<T>>[];

	constructor(model, relation) {
		this.relations = relation;
		this.model = model;		
	}

	init(broker: ServiceBroker, service: MoleculerService) {
		this.broker = broker;
		this.service = service;
		this.model.sync();
		this.db = sequelizeConnect
	}

	connect() {
		return this.db.authenticate().then(() => {
			console.log("Connect")			
		});
	}

	disconnect() {
		if (this.db) {
			return this.db.close();
		}
		return Promise.resolve();
	}

}


export interface SequelizeDbAdapterProps<T extends BaseModel> {
	relations: any;
	db: SequelizeModel;
	model: ModelCtor<Result<T>>;
}

export interface Result<T extends BaseModel> extends ModelSequelize<any, any> {
	dataValues: T;
}

module.exports = SequelizeDbAdapter