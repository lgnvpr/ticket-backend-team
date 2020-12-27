/* eslint-disable camelcase */
/* eslint-disable max-len */
"use strict";
import { ChairCar } from "@Core/base-carOwner/ChairCar";
import { IFind } from "@Core/query/IFind";
import BaseServiceCustom from "@Service/BaseServiceCustom";
import { Service as MoleculerService, Context } from "moleculer";
import { Action, Method, Service } from "moleculer-decorators";
import { IList } from "server/base-ticket-team/query/IList";
import { serviceName } from "@Core/query/NameService";
import config from "server/config";
import { IGet } from "@Core/query/IGet";
import { ListChairCar } from "@Core/controller.ts/ListChairCar";
import { chairCarModelSequelize } from "server/model-sequelize/ChairCarModel";
import { BaseServiceWithSequelize } from "server/base-service/sequelize/BaseServiceWithSequelize";
import { carModelSequelize } from "server/model-sequelize/CarModel";
const MongoDBAdapter = require("moleculer-db-adapter-mongo");
const DbService = require("moleculer-db");
const DBServiceCustom = require("../../base-service/sequelize/DbServiceSequelize");
const SqlAdapter = require("../../base-service/sequelize/SequelizeDbAdapter");

@Service({
	name: serviceName.chairCar,
	mixins: [DBServiceCustom],
	adapter: new SqlAdapter(chairCarModelSequelize, []),
	dependencies: ["dbCustomSequelize", serviceName.car],
	settings: {
		populates: [
			{ field: "car", service: serviceName.car, filedGet: "carId" },
		],
	},
	collection: serviceName.chairCar,
})
class ChairCarService extends BaseServiceWithSequelize<ChairCar> {

	@Action()
	public countGroupByCarIds(ctx: Context<any>) {
        var carIds = ctx.params.carIds ||"" ;
		// return this.adapter.collection
		// 	.aggregate([
		// 		{
		// 			$match: {
		// 				carId: {
		// 					$in: carIds
		// 				},
		// 			},
		// 		},
		// 		{
		// 			$group: {
		// 				_id: "$carId",
		// 				count: { $sum: 1 },
		// 			},
		// 		},
		// 	])
		// 	.toArray();
		const sql = `select chair_cars."carId" , count(*) from chair_cars
		where "carId" in (?)
		group by chair_cars."carId" 
		`
		return this.adapter.db.query(sql, {replacements : [carIds]}).then(([res]: any)=>{
			return res
		})
	}

	@Action()
	public autoCreateChair(ctx: Context) {
		let params: any = ctx.params;

		let carId = params.carId;
		let floor = parseInt(params.floor.toString());
		let row = parseInt(params.row.toString());
		let column = parseInt(params.column.toString());
		
		
		if (!floor || !row || !column) {
			throw new Error("Vui lòng nhập đúng thông tin");
		}

		let listChair: Array<any> = new Array();
		for (let fl = 1; fl <= floor; fl++) {
			for (let rw = 1; rw <= row; rw++) {
				for (let cl = 1; cl <= column; cl++) {
					let getColumn = 0;
					console.log(column);
					console.log(cl)
					if (column === 1) getColumn = 3;
					else if (column === 2) getColumn = cl*2;
					else  if (column === 3) getColumn = Math.floor(cl * 1.9);
					else if(column === 4 ){
						cl >= 3
						? (getColumn = cl + 1)
						: (getColumn = cl);
					}
					if (column === 5) getColumn = cl;

					console.log(getColumn)
					let newChair = {
						carId: carId,
						name: this.codeChair(fl, getColumn, rw),
						localColumn: getColumn,
						localRow: rw,
						localFloor: fl,
					};
					console.log(newChair)
					listChair.push(newChair);
				}
			}
		}

		// console.log(listChair)
		return this._sequelizeCreate(listChair as any);
	}

	@Action()
	public async getByCarId(ctx: Context) {
		let params: any = ctx.params;
		var carId: any = params.carId.toString();
		let getData: ChairCar[] = await this._sequelizeFind( {
			query: { carId: carId }
		});
		let floor: Array<any> = [];
		let row: Array<any> = [];

		getData.map((chair: ChairCar) => {
			floor.push(chair.localFloor);
			row.push(chair.localRow);
		});
		floor = floor.filter(function (el) {
			return el != null && el != "";
		});
		row = row.filter(function (el) {
			return el != null && el != "";
		});
		floor = floor.filter((value, index, self) => {
			return self.indexOf(value) === index;
		});
		row = row.filter((value, index, self) => {
			return self.indexOf(value) === index;
		});
		row = row.sort((a, b )=>{
			if(a>b) return 1 ;
			if(a<b) return -1;
			return 0
		})

		floor = floor.sort((a, b )=>{
			if(a>b) return 1 ;
			if(a<b) return -1;
			return 0
		})

		let testData = floor.map((floor, getFloor) => {
			let createRow = row.map((row: any) => {
				let chair = getData.filter(
					(chair: ChairCar) =>
						chair.localFloor == floor && chair.localRow == row
				);
				let newRows: Array<any> = new Array();
				for (let i = 1; i <= 5; i++) {
					newRows.push(
						chair.find((res: ChairCar) => res.localColumn == i) || {
							localFloor: getFloor + 1,
							localColumn: i,
							localRow: row,
							carId: carId,
						}
					);
				}
				return newRows;
			});
			return createRow;
		});
		var diagramChair: ListChairCar = {
			dataListChar: testData
		}
		return diagramChair;
	}

	private codeChair(fl: number, column: number, rw: number): string {
		let getNameFloor = fl == 1 ? "L" : "D";
		let getNameColum ;
		if(column===1) getNameColum ="A";
		if(column===2) getNameColum ="B";
		if(column===3) getNameColum ="C";
		if(column===4) getNameColum ="D";
		if(column===5) getNameColum ="E"; 
		return `${getNameFloor}${rw}${getNameColum}`;
	}
}

module.exports = ChairCarService;
