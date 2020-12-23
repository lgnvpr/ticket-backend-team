import { BaseModel } from "@Core/query/BaseModel";
import { ICount } from "@Core/query/ICount";
import { IFind } from "@Core/query/IFind";
import { IList } from "@Core/query/IList";
import { Paging } from "@Core/query/Paging";
import { Model, ModelDefined, Optional, Sequelize } from "sequelize";
import { sequelizeConnect } from "server/model-sequelize";
import { Service as MoleculerService, Context } from "moleculer";
import { BaseService } from "../BaseService";
import { SequelizeDbAdapterProps } from "../sequelize/SequelizeDbAdapter";

const errorMessage =
	"This method created just for making the interface and suggestion when coding. Please mixin your service with DbServiceCustom";


export class BaseServiceWithSequelize<
  T extends BaseModel
> extends BaseService<T>{
  public myAdapter:MyAdapterProps<T> =  sequelizeConnect;
  
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

export class MyAdapterProps<T extends BaseModel> extends Sequelize{
  modelDefine ?: ModelDefined<Model<T, Optional<T, "id">>, T>;
  relations ?:ModelDefined<Model<any, Optional<any, "id">>, any>[];
  init?:()=> void
}