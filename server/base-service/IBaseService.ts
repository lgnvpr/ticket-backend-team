import { BaseModel } from "@Core/query/BaseModel";
import { ICount } from "@Core/query/ICount";
import { IFind } from "@Core/query/IFind";
import { IGet } from "@Core/query/IGet";
import { IList } from "@Core/query/IList";
import { Paging } from "@Core/query/Paging";
import { Context } from "moleculer";

export interface IBaseService<T extends BaseModel> {
    _find(ctx: Context, params: IFind): Promise<T[]>;
    _count(ctx: Context, params: ICount): Promise<number>;
    _list(ctx: Context, params: IList): Promise<Paging<T>>;
    _create(ctx: Context, t: T): Promise<T>;
    _insert(ctx: Context, params: T | T[]): Promise<T | T[]>;
    _get(ctx: Context, params: IGet): Promise<T | undefined>;
    _update(ctx: Context, t: T): Promise<T>;
    _remove(ctx: Context, t: T): Promise<T>;
  }