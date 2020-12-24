import { BaseModel } from "@Core/query/BaseModel";
import { ICount } from "@Core/query/ICount";
import { IFind } from "@Core/query/IFind";
import { IList } from "@Core/query/IList";
import { Paging } from "@Core/query/Paging";
import { Model, ModelDefined, Optional } from "sequelize";
import { BaseService } from "../BaseService";
import { SequelizeDbAdapterProps } from "../sequelize/SequelizeDbAdapter";

const errorMessage =
	"This method created just for making the interface and suggestion when coding. Please mixin your service with DbServiceCustom";


export class BaseServiceWithSequelize<
  T extends BaseModel
> extends BaseService<T>{
  adapter: SequelizeDbAdapterProps<T>;

  async _sequelizeList(params: IList): Promise<Paging<T>> {
		throw Error(errorMessage);
  }
  async _sequelizeCount(params: ICount): Promise<number> {
		throw Error(errorMessage);
  }
  async _sequelizeFind(params: IFind): Promise<T[]> {
		throw Error(errorMessage);
  }
  async _sequelizeRemove(params: {id : string}): Promise<T> {
		throw Error(errorMessage);
  }
  async _sequelizeCreate(params: T): Promise<T> {
		throw Error(errorMessage);
  }
}
