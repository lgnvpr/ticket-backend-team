"use strict";
import { Service as MoleculerService, Context } from "moleculer";
import { DbService } from "moleculer-db";
import { Action, Service } from "moleculer-decorators";
import { BaseModel, Status } from "server/base-ticket-team/query/BaseModel";
import { IList } from "server/base-ticket-team/query/IList";
import { Paging } from "server/base-ticket-team/query/Paging";
import { QueryHelper } from "server/helper/QueryHelper";
import { uuid } from 'uuidv4';
const MongoDBAdapter = require("moleculer-db-adapter-mongo");





class MongoBaseService<T extends BaseModel> extends MoleculerService {
  _customGet(ctx: Context, params: {id : string | string[]}) {
    params = this.sanitizeParams(ctx, ctx.params);
    return this._get(ctx, params)
      .then((value: any) => {
        if (Array.isArray(params.id)) {
          return value;
        } else {
          if (value.status === Status.active.toString()) return value;
          else throw new Error(value.id);
        }
      })
      .catch((error: any) => {
        console.log(error);
        throw error;
      });
  }

  _customCreate(ctx: Context<any , any>, params: T): Promise<T> {
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
    // if (ctx.service.settings.populates) {
    //   const populateFields = Object.keys(ctx.service.settings.populates);
    //   params = {
    //     ...params,
    //     populate: populateFields,
    //   };
    // }

    const page = params.page ? Number(params.page) : 1;
    const pageSize = params.pageSize ? Number(params.pageSize) : 10;
    let sort = params.sort
    console.log(sort);
    if(!sort ||sort.length ==0 ) { sort=["createAt"] }
    
    const combinedQueries = QueryHelper.combineSearchesToQuery(
      {search : params.search,
      searchFields : params.searchFields},
      params.query
    );

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
      getPopulates.map(async(populate)=>{
        var ids = list.rows.map((item)=>{
          return item[populate.filedGet];
        })
        
        let getField : Array<any> =await ctx.broker.call(`${populate.service}.get`, {id : ids});
        list.rows = list.rows.map((item)=>{
          item.metaMapping = {}
          item.metaMapping[populate.field] = getField.find((itemField)=>{
            return item[populate.filedGet] == itemField._id
          }) 
          return item;
        })
      })  
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

  public async _customFind(ctx, params: any):Promise<T[]>{
    return this._find(ctx, params);
  }


}
export = MongoBaseService

 

