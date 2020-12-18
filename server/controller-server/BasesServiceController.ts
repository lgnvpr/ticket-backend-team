
import { BaseModel } from "@Core/query/BaseModel";
import { ICount } from "@Core/query/ICount";
import { IFind } from "@Core/query/IFind";
import { IList } from "@Core/query/IList";
import { Paging } from "@Core/query/Paging";
import { Context } from "moleculer";

const errorMessage = "This method is not implement";

export class BaseServiceController<T extends BaseModel> {
  serviceName: string;
  constructor(serviceName: string) {
    this.serviceName = serviceName;
  }

  async _find(ctx: Context, params: IFind): Promise<T[]> {
    return ctx.broker.call(`${this.serviceName}.find`, params);
  }

  async _count(ctx: Context, params: ICount): Promise<number> {
    return ctx.broker.call(`${this.serviceName}.count`, params);
  }
  async _list(ctx: Context, params: IList): Promise<Paging<T>> {
    return ctx.broker.call(`${this.serviceName}.list`, params);
  }
  async _create(ctx: Context, t: T): Promise<T> {
    return ctx.broker.call(`${this.serviceName}.create`, t);
  }
  async _insert(ctx: Context, params: T | T[]): Promise<T | T[]> {
    return ctx.broker.call(`${this.serviceName}.insert`, params);
  }

  async _get(ctx: Context, params: any): Promise<T | undefined> {
    return ctx.broker.call(`${this.serviceName}.get`, params);
  }
//   async _update(ctx: Context, t: T): Promise<T> {
//     return ctx.broker.call(`${this.serviceName}.update`, t);
//   }
  async _remove(ctx: Context, t: T): Promise<T> {
    return ctx.broker.call(`${this.serviceName}.remove`, t);
  }
}
