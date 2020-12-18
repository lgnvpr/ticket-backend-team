/* eslint-disable camelcase */
"use strict";
import { Status } from "@Core/query/BaseModel";
import { ICount } from "@Core/query/ICount";
import { IFind } from "@Core/query/IFind";
import { IList } from "@Core/query/IList";
import { Service as MoleculerService, Context } from "moleculer";
const { Op } = require("sequelize");
const DbService = require("moleculer-db");
import { v4 as uuidv4 } from "uuid";
import { SequelizeDbAdapterProps } from "./SequelizeDbAdapter";


const CustomService: any = {
	name: "dbCustomSequelize",
	mixins: [DbService],
	settings: {
		/** @type {String} Name of ID field. */
		idField: "id",

		/** @type {Array<String>?} Field filtering list. It must be an `Array`. If the value is `null` or `undefined` doesn't filter the fields of entities. */
		fields: null,

		/** @type {Array?} Schema for population. [Read more](#populating). */
		populates: null,

		/** @type {Number} Default page size in `list` action. */
		pageSize: 10,

		/** @type {Number} Maximum page size in `list` action. */
		maxPageSize: 100,

		/** @type {Number} Maximum value of limit in `find` action. Default: `-1` (no limit) */
		maxLimit: -1,

		/** @type {Object|Function} Validator schema or a function to validate the incoming entity in `create` & 'insert' actions. */
		entityValidator: null,

		/** @type {Boolean} Whether to use dot notation or not when updating an entity. Will **not** convert Array to dot notation. Default: `false` */
		useDotNotation: false,
	},
	actions: {
		list(ctx: Context) {
			return this._sequelizeList(ctx.params);
		},
		remove (ctx: Context){
			return this._sequelizeRemove(ctx.params);
		},

		create(ctx: Context) {
		},

		insertMany(ctx: Context) {
			return this._sequelizeCreateMany(ctx, ctx.params);
		},

		// updateMany(ctx: Context) {
		// 	return this._customUpdateMany(ctx, ctx.params);
		// },

		find(ctx: Context) {
			return this._sequelizeFind(ctx, ctx.params);
		},
		count(ctx: Context){
			return this._sequelizeCount(ctx.params)
		}
	},

	methods: {
		getRelations() {
			const relations = this.adapter.relations;
			if (relations && relations.length > 0) {
				const newRelations = relations.map((relation) => {
					const query = {
						model: relation,
						where: {
							[Op.and]: [{ status: Status.active }],
						},
					};
					return query;
				});
				return newRelations;
			}
			return [];
		},
		sanitizeParamsBaseListPropsSequelize(params){
			if (params.sort) {
				// add sort by created
				if (typeof params.sort === "string") {
					params.sort = params.sort.replace(/,/g, " ").split(" ");
				}
				params.sort = params.sort.map((sortItem) => {
					const typeSort =
						sortItem.substring(0, 1) === "-" ? "DESC" : "ASC";
					const getName =
						sortItem.substring(0, 1) === "-"
							? sortItem.substring(1, sortItem.length)
							: sortItem;
					return [getName, typeSort];
				}) as any; // [["Name", "Desc"],["Name", "Desc"]]
			} else params.sort = [];

			if (params.searchFields &&params.searchFields.length >0) {
				if (typeof params.searchFields === "string") {
					params.searchFields = params.searchFields.trim()
					params.searchFields = params.searchFields
						.replace(/,/g, " ")
						.split(" ");
				}
				params.search = params.searchFields.map((field) => {
					return {
						[field]: { [Op.iLike]: `%${params.search || ""}%` },
					};
				}) as any;
			}else {
				params.search = [{ status: Status.active }]  // ! Hơi củ chuối
			}
			return params;
		},
		sanitizeParamsListSequelize(params: IList): IList {
			params = {...params}
			if (typeof params.page === "string")
				params.page = Number(params.page) ;

			if (!params.page) params.page = 1;

			if (typeof params.pageSize === "string")
				params.pageSize = Number(params.pageSize) || 10;

			if (!params.pageSize) params.pageSize = 10;

			if (typeof params.query === "string")
				params.query = JSON.parse(params.query);
			if (!params.query) params.query = {};
			
			params =this.sanitizeParamsBaseListPropsSequelize(params)
			return params;
		},
		sanitizeParamsFindSequelize(params: IFind) {
			if (typeof params.limit === "string")
				params.limit = Number(params.limit) | 1;
			if (!params.offset) params.offset = 1;
			
			if (typeof params.query === "string")
				params.query = JSON.parse(params.query);
			if (!params.query) params.query = {};
			params =this.sanitizeParamsBaseListPropsSequelize(params)
			return params;
		},
		
		async _sequelizeCreate(params){
			if(Array.isArray(params)){
				params = params.map(item=>{
					item.updatedAt = new Date();
					item.id = uuidv4();
					return item
				})
				return this.adapter.model.bulkCreate(params)

			}
			params.updatedAt = new Date();
			 ("on create one")
			if(params.id){
				 ("on udpate")
				var obj=await this.adapter.model.findByPk(params.id)
				.catch(()=>{})
				if(obj) {
					 ("on update thành công")
					 await this.adapter.model.update(params, {where: {id : params.id}})
					if(obj) return {
						...obj.dataValues,
						...params
					}
				}
			}
			params.id = uuidv4()
			return this.model.create(params)
		},

		async _sequelizeCreateMany(params){
			return  this.model.insert(params)
		},
		async _sequelizeRemove(params){
			if(params.id){
				var obj=await this.adapter.model.findByPk(params.id)
				.catch(()=>{})
				if(obj) {
					obj.updateAt = new Date()
					 await this.adapter.model.update({...obj.dataValues, status: Status.deleted}, {where: {id : params.id}})
					if(obj) return {
						...obj.dataValues,
						status : Status.deleted
					}
					throw new Error("Cannot Delete");
				}
			}
		},
		
		async _sequelizeList(params: IList) {
			params = this.sanitizeParamsListSequelize(params);
			const getRelations = this.getRelations()
			var dataPaging =await this.adapter.model.findAndCountAll({
				include: getRelations,
				where: {
					[Op.and]: [{ status: Status.active }, params.query],
					[Op.or]: params.search,
				},
				limit: params.pageSize || 10,
				offset: (params.page - 1) * params.pageSize,
				order: params.sort,
			});
			 (dataPaging.rows)
			dataPaging.rows = dataPaging.rows?.map(item=>{
				if( item&&item?.dataValues){
					return item.dataValues
				}
				return item
			})
			return {
				page : params.page,
				pageSize : params.pageSize,
				total : await dataPaging.count,
				totalPages : Math.ceil(dataPaging.count / params.pageSize),
				rows : await dataPaging.rows
			}
		},
		async _sequelizeCount(params: ICount) {
			params = this.sanitizeParamsListSequelize(params);
			return await this.adapter.model.count({
				where: {
					[Op.and]: [{ status: Status.active }, params.query],
					[Op.or]: params.search,
				},
			});
		},
		async _sequelizeFind(params: IFind) {
			params = this.sanitizeParamsListSequelize(params);
			var data = await this.adapter.model.findAll({
				where: {
					[Op.and]: [{ status: Status.active }, params.query],
					[Op.or]: params.search,
				},
				limit: params.limit || null,
				offset: params.offset||null,
				order: params.sort,
			});

			data = data?.map(item=>{
				if( item&&item?.dataValues){
					return item.dataValues
				}
				return item
			})
			return data
		},
	},
};

export = CustomService;