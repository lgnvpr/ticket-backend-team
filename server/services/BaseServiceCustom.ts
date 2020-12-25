"use strict";
import { IFind } from "@Core/query/IFind";
import { IGet } from "@Core/query/IGet";
import { Service as MoleculerService, Context } from "moleculer";
import { DbService } from "moleculer-db";
import { Action, Service } from "moleculer-decorators";
import { BaseServiceWithMongo } from "server/base-service/mongo/BaseServiceWithMongo";
import { BaseModel, Status } from "server/base-ticket-team/query/BaseModel";
import { IList } from "server/base-ticket-team/query/IList";
import { Paging } from "server/base-ticket-team/query/Paging";
import { QueryHelper } from "server/helper/QueryHelper";
import { uuid } from 'uuidv4';
const MongoDBAdapter = require("moleculer-db-adapter-mongo");





class BaseServiceCustom<T extends BaseModel> extends BaseServiceWithMongo<T> {
  _customGet(ctx: Context, params: IGet): Promise<T> {
    params = this.sanitizeParams(ctx, ctx.params);
    // return this._find(ctx, {}) as any;

    return this._get(ctx, params)
      .then((value) => {
        return value
      })
      .catch((error) => null);
  }
  _customCreateMany(ctx: Context<any ,any>, params: T[]): Promise<T[]|T> {
    const newParams: any ={
      entities : []
    }
    newParams.entities = params.map((item)=>{
      return  {
        ...item,
        _id: uuid(),
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: ctx.meta?.user?.id,
        updatedBy: ctx.meta?.user?.id,
        status: Status.active,
      };
    }) as any

    return this._insert(ctx, newParams);
  }

  _customCreate(ctx: Context<any , any>, params: T): Promise<T> {
    delete params.metaMapping
    return this._get(ctx, { id: params._id })
      .then((value: any) => {
        const updatedValue = {
          ...value,
          ...params,
          createdAt: value.createdAt,
          updatedAt: new Date(),
          updatedBy: ctx.meta?.user?.id as any,
          status: Status.active,
        };
        return this._update(ctx, updatedValue).then((dbUpdatedValue: any) => {
          return dbUpdatedValue;
        });
      })
      .catch((error: any) => {
        delete params._id;
        const newValue = {
          ...params,
          _id: uuid(),
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: ctx.meta?.user?.id,
          updatedBy: ctx.meta?.user?.id,
          status: Status.active,
        };
        return this._create(ctx, newValue).then((dbNewValue: any) => {
          return dbNewValue;
        });
      });
  }

  public async _customList(ctx: Context, params: IList) : Promise<Paging<T>>{
    let newParams: any = params;
    const page = params.page ? Number(params.page) : 1;
    const pageSize = params.pageSize ? Number(params.pageSize) : 10;
    let sort = params.sort
    console.log(sort);
    if(!sort ||sort.length ==0 ) { sort=["createAt"] }
    params = this.sanitizeParams(ctx, params);
    
    const combinedQueries = QueryHelper.combineSearchesToQuery(
      {search : params.search,
      searchFields : params.searchFields},
      params.query
    );
    console.log(combinedQueries)
    delete params.searchFields;
    delete params.search;
    newParams = {
      ...params,
      page: page,
      pageSize: pageSize,
      offset: (page - 1) * pageSize,
      limit: pageSize,
      query: {...combinedQueries, status : Status.active}, // TODO : status: Status.active
      sort : sort
    };
    var list :Paging<T> =  await this._list(ctx, newParams);
    
    if (ctx.service.settings.populates) {
      let getPopulates = ctx.service.settings.populates;
      list.rows = await this.mapping(ctx, getPopulates, list.rows);
    }
    if (ctx.service.settings.populates) {
      let getPopulates = ctx.service.settings.populates;
      list.rows = await this.mapping(ctx, getPopulates, list.rows);
    }
    if (ctx.service.settings.populates) {
      let getPopulates = ctx.service.settings.populates;
      list.rows = await this.mapping(ctx, getPopulates, list.rows);
    }
    return list;

  }

  public _customRemove(ctx: Context, params: {id : string}): Promise<T> {
    return this._get(ctx, params)
      .then((result: any) => {
        result = {
          ...result,
          status: Status.deleted,
        };
        return this._update(ctx, result)
          .then((updateRespond: any) => {
            return result;
          })
          .catch((error1: any) => {
            console.log(error1);
          });
      })
      .catch((error: any) => {
        throw new Error(`Object with ID ${params.id} is not exist`);
      });
  }

  public async _customFind(ctx, params: IFind):Promise<T[]>{
    // params = this.sanitizeParams(ctx, params);
    var list = await this._find(ctx, params);
    // if (ctx.service.settings.populates) {
    //   let getPopulates = ctx.service.settings.populates;
    //   list = await this.mapping(ctx, getPopulates, list);
    // }
    return list;
  }

  private async mapping(ctx: Context,getPopulates:any , list: T[]): Promise<T[]>{
     getPopulates.map(async(populate)=>{
      var ids = list.map((item)=>{
        return item[populate.filedGet];
      })
      
      let getField : Array<any> =await ctx.broker.call(`${populate.service}.get`,{id : ids} );
      list = list.map((item)=>{
        if(!item.metaMapping) item.metaMapping = {}
        item.metaMapping[populate.field] = getField.find((itemField)=>{
          return item[populate.filedGet] == itemField._id
        }) 
        return item;
      })
    })
    return list;
  }


}
export = BaseServiceCustom

 

