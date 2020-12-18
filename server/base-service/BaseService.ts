"use strict";
import { BaseModel } from "@Core/query/BaseModel";
import { ICount } from "@Core/query/ICount";
import { IFind } from "@Core/query/IFind";
import { IGet } from "@Core/query/IGet";
import { IList } from "@Core/query/IList";
import { Paging } from "@Core/query/Paging";
import { Service as MoleculerService, Context } from "moleculer";
import { v4 as uuidv4 } from "uuid";
import { IBaseService } from "./IBaseService";

const errorMessage =
  "This method created just for making the interface and suggestion when coding. Please mixin your service with DbService";

export class BaseService<T extends BaseModel>
  extends MoleculerService
  implements IBaseService<T> {

  async _find(ctx: Context, params: IFind): Promise<T[]> {
    throw Error(errorMessage);
  }
  async _count(ctx: Context, params: ICount): Promise<number> {
    throw Error(errorMessage);
  }
  async _list(ctx: Context, params: IList): Promise<Paging<T>> {
    throw Error(errorMessage);
  }
  async _create(ctx: Context, t: T): Promise<T> {
    throw Error(errorMessage);
  }
  async _insert(ctx: Context, params: any): Promise<T | T[]> {
    throw Error(errorMessage);
  }
  async _get(ctx: Context, params: IGet): Promise<T | undefined> {
    throw Error(errorMessage);
  }
  async _update(ctx: Context, t: T): Promise<T> {
    throw Error(errorMessage);
  }
  async _remove(ctx: Context, t: T): Promise<T> {
    throw Error(errorMessage);
  }


}
