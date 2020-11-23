"use strict";
import { Service as MoleculerService, Context } from "moleculer";
import { DbService } from "moleculer-db";
import { Action, Service } from "moleculer-decorators";
import { uuid } from 'uuidv4';
const MongoDBAdapter = require("moleculer-db-adapter-mongo");





class MongoBaseService extends MoleculerService {
  

  _customGet(ctx: Context, params: any) {
    params = this.sanitizeParams(ctx, ctx.params);
    if (ctx.service.settings.populates) {
      const populateFields = Object.keys(ctx.service.settings.populates);
      params = {
        ...params,
        populate: populateFields,
      };
    }
    return this._get(ctx, params)
      .then((value: any) => {
        if (Array.isArray(params.id)) {
          return value;
        } else {
          // if (value.status === Status.actived.toString()) return value;
          // else throw new EntityNotFoundError(value.id);
        }
      })
      .catch((error: any) => {
        console.log(error);
        throw error;
      });
  }

  _customCreate(ctx: Context, params: any) {
    return this._get(ctx, { id: params._id })
      .then((value: any) => {
        const updatedValue = {
          ...value,
          ...params,
          createdAt: value.createdAt,
          updatedAt: new Date(),
          // updatedBy: ctx.meta?.user?.id,
          status: "actived",
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
          // createdBy: ctx.meta?.user?.id,
          // updatedBy: ctx.meta?.user?.id,
          status: "actived",
        };
        return this._create(ctx, newValue).then((dbNewValue: any) => {
          return dbNewValue;
        });
      });
  }

  public async _customList(ctx: Context, params: any){

    if (ctx.service.settings.populates) {
      const populateFields = Object.keys(ctx.service.settings.populates);
      params = {
        ...params,
        populate: populateFields,
      };
    }

    const page = params.page ? Number(params.page) : 1;
    const pageSize = params.pageSize ? Number(params.pageSize) : 20;

    // conver seachs => query & combine with current query
    // const combinedQueries = QueryHelper.combineSeachsToQuery(
    //   params.searchs,
    //   params.query
    // );
    //  return combinedQueries;
    params = {
      ...params,
      page: page,
      pageSize: pageSize,
      offset: (page - 1) * pageSize,
      limit: pageSize,
      query: { },
    };
    return this._list(ctx, params);
  }

  public _customRemove(ctx: Context, params: any) {
    return this._get(ctx, params)
      .then((result: any) => {
        result = {
          ...result,
          // status: Status.deleted,
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


}
export = MongoBaseService

