/* eslint-disable camelcase */
/* eslint-disable max-len */
"use strict";
import { ChairCar } from "@Core/base-carOwner/ChairCar";
import { IFind } from "@Core/query/IFind";
import MongoBaseService from "@Service/MongoBaseService";
import { Service as MoleculerService, Context } from "moleculer";
import { Action, Method, Service } from "moleculer-decorators";
import { Staff } from "server/base-ticket-team/base-carOwner/Staff";
import { IList } from "server/base-ticket-team/query/IList";
import { serviceName } from "@Core/query/NameService";
import config from "server/config";
const MongoDBAdapter = require("moleculer-db-adapter-mongo");
const DbService = require("moleculer-db");

@Service({
	name: serviceName.chairCar,
	mixins: [DbService],
	adapter: new MongoDBAdapter(config.URLDb),
	settings: {
		populates: [
			{ field: "car", service: serviceName.car, filedGet: "carId" },
		],
	},
	collection: serviceName.chairCar,
})
class ChairCarService extends MongoBaseService<ChairCar> {
	@Action()
	public create(ctx: Context<ChairCar>) {
		return this._customCreate(ctx, ctx.params);
	}
	@Action()
	public list(ctx: Context<IList>) {
		return this._customList(ctx, ctx.params);
	}

	@Action()
	public remove(ctx: Context<{ id: string }>) {
		return this._customRemove(ctx, ctx.params);
	}

	@Action()
	public count(ctx: Context) {
		return this._count(ctx, ctx.params);
	}

	@Action()
	public get(ctx: Context<{ id: string | string[] }>) {
		return this._customGet(ctx, ctx.params);
	}

	@Action()
	public find(ctx: Context<IFind>) {
		return this._customFind(ctx, ctx.params);
	}

	@Action()
	public countGroupByCarIds(ctx: Context<any>) {
        var carIds = ctx.params.id ||"" ;
		return this.adapter.collection
			.aggregate([
				{
					$match: {
						carId: {
							$in: carIds
						},
					},
				},
				{
					$group: {
						_id: "$carId",
						count: { $sum: 1 },
					},
				},
			])
			.toArray();
	}

	@Action()
	public autoCreateChair(ctx: Context) {
		let params: any = ctx.params;

		let carId = params.carId;
		let floor = params.floor;
		let row = params.row;
		let column = params.column;
		if (!floor || !row || !column) {
			throw new Error("Vui lòng nhập đúng thông tin");
		}

		let listChair: Array<any> = new Array();
		for (let fl = 1; fl <= floor; fl++) {
			for (let rw = 1; rw <= row; rw++) {
				for (let cl = 1; cl <= column; cl++) {
					let getColumn = 0;
					if (column == 1) getColumn = 3;
					if (column == 2) getColumn = (cl - 1) * 4 + 1;
					if (column == 3) getColumn = Math.floor(cl * 1.9);
					column == 4 && cl >= 3
						? (getColumn = cl + 1)
						: (getColumn = cl);
					if (column == 5) getColumn = column;

					let newChair = {
						carId: carId,
						codeChair: this.codeChair(fl, column, rw),

						localColumn: getColumn,
						localRow: rw,
						localFloor: fl,
					};
					listChair.push(newChair);
				}
			}
		}
		return this._customCreateMany(ctx, listChair as any);
	}

	@Action()
	public async getByCarId(ctx: Context) {
		let params: any = ctx.params;
		var carId: any = params.carId.toString();

		let getData: ChairCar[] = await this._customFind(ctx, {
			query: { carId: carId },
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
							CarId: carId,
						}
					);
				}
				return newRows;
			});
			return createRow;
		});
		return testData;
	}

	private codeChair(fl: number, column: number, rw: number): string {
		let getNameFloor = fl == 1 ? "L" : "D";
		let getNameCollum =
			column == 1
				? "A"
				: column == 2
				? "B"
				: column == 3
				? "C"
				: column == 4
				? "D"
				: "E";
		return `${getNameFloor} ${rw}${getNameCollum}`;
	}
}

module.exports = ChairCarService;
