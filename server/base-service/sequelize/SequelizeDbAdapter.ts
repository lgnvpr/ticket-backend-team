"use strict";
const { ServiceSchemaError } = require("moleculer").Errors;
const Sequelize = require("sequelize");
import _ from "lodash";
import {
  ModelCtor,
  Model as ModelSequelize,
  Sequelize as SequelizeModel,
} from "sequelize/types";
import { ServiceBroker, Service as MoleculerService } from "moleculer";
import { BaseModel, Status } from "@Core/query/BaseModel";
const { Model, Op } = Sequelize;

class SequelizeDbAdapter<T extends BaseModel>{
  opts: any;
  broker: ServiceBroker;
  service: MoleculerService;
  db: SequelizeModel;
  model: ModelCtor<Result<T>>;

  // otps is: "postgres://username:password@host:port/db_name"
  constructor(...opts) {
    this.opts = opts;
  }

  init(broker: ServiceBroker, service: MoleculerService) {
    this.broker = broker;
    this.service = service;
    if (!this.service.schema.model) {
      throw new ServiceSchemaError(
        "Missing `model` definition in schema of service!"
      );
    }
  }

  connect() {
    const sequelizeInstance = this.opts[0];

    if (sequelizeInstance && sequelizeInstance instanceof Sequelize)
      this.db = sequelizeInstance;
    else this.db = new Sequelize(...this.opts);
     (this.db);

    return this.db.authenticate().then(() => {
      let modelDefinitionOrInstance = this.service.schema.model;

      let noSync = false;
      if (
        this.opts[0] &&
        Object.prototype.hasOwnProperty.call(this.opts[0], "noSync")
      ) {
        noSync = !!this.opts[0].noSync;
      } else if (
        this.opts[0] &&
        Object.prototype.hasOwnProperty.call(this.opts[0], "sync")
      ) {
        noSync = !this.opts[0].sync.force;
      } else if (
        this.opts[3] &&
        Object.prototype.hasOwnProperty.call(this.opts[3], "sync")
      ) {
        noSync = !this.opts[3].sync.force;
      } else if (this.opts[3]) {
        noSync = !!this.opts[3].noSync;
      }

      let modelReadyPromise;
      let isModelInstance =
        modelDefinitionOrInstance &&
        (Object.prototype.hasOwnProperty.call(
          modelDefinitionOrInstance,
          "attributes"
        ) ||
          modelDefinitionOrInstance.prototype instanceof Model);
      if (isModelInstance) {
        this.model = modelDefinitionOrInstance;
        modelReadyPromise = Promise.resolve();
      } else {
        this.model = this.db.define(
          modelDefinitionOrInstance.name,
          modelDefinitionOrInstance.define,
          modelDefinitionOrInstance.options
        );
        modelReadyPromise = noSync
          ? Promise.resolve(this.model)
          : this.model.sync();
      }
      this.service.model = this.model;
      return modelReadyPromise
        .then(() => {
          this.service.logger.info(
            "Sequelize adapter has connected successfully."
          );
        })
        .catch((e) => {
          return this.db.close().finally(() => Promise.reject(e));
        });
    });
  }

  disconnect() {
    if (this.db) {
      return this.db.close();
    }
    return Promise.resolve();
  }

  find(filters: Filter) {
    return this.createCursor(filters);
  }

  findOne(query: any) {
    query = {
      ...query,
      status: Status.active,
    };
    return this.model.findOne(query);
  }

  findById(id: string) {
    return this.model.findByPk(id).then((item) => {
      if (
        item &&
        this.entityToObject(item) &&
        this.entityToObject(item).status === Status.active
      ) {
        return item;
      } else {
        return null;
      }
    });
  }

  findByIds(ids: string[]) {
    return this.model
      .findAll({
        where: {
          id: {
            [Op.in]: ids,
          },
          status: Status.active,
        },
      })
      .then((items) => {
        return items;
      });
  }

  count(filters: Filter) {
    return this.createCursor(filters, true);
  }

  insert(entity: T) {
    return this.model.create(entity);
  }

  insertMany(entities: T[], opts = { returning: true }) {
    return this.model.bulkCreate(entities, opts);
  }

  updateMany(where, update: T) {
    return this.model.update(update, { where }).then((res) => res[0]);
  }

  updateById(_id: string, update: T) {
    return this.findById(_id).then((entity) => {
      return entity && entity.update(update["$set"]);
    });
  }

  removeMany(where) {
    return this.model.destroy({ where });
  }

  removeById(_id: string) {
    return this.findById(_id).then((entity) => {
      return entity && entity.destroy().then(() => entity);
    });
  }

  clear() {
    return this.model.destroy({ where: {} });
  }

  entityToObject(entity): T {
    return entity.get({ plain: true });
  }

  createCursor(params: Filter, isCounting?: boolean) {
    if (!params) {
      if (isCounting) return this.model.count();

      return this.model.findAll();
    }

    const q = {
      where: {
        status: Status.active,
      },
    } as any;

    // Text search
    if (_.isString(params.search) && params.search !== "") {
      let fields = [];
      if (params.searchFields) {
        fields = _.isString(params.searchFields)
          ? params.searchFields.split(" ")
          : params.searchFields;
      }

      const searchConditions = fields.map((f) => {
        return {
          [f]: {
            [Op.like]: "%" + params.search + "%",
          },
        };
      });

      if (params.query) {
        q.where[Op.and] = [params.query, { [Op.or]: searchConditions }];
      } else {
        q.where[Op.or] = searchConditions;
      }
    } else if (params.query) {
      Object.assign(q.where, params.query);
    }

    // Sort
    if (params.sort) {
      let sort = this.transformSort(params.sort);
      if (sort) q.order = sort;
    }

    // Offset
    if (_.isNumber(params.offset) && params.offset > 0)
      q.offset = params.offset;

    // Limit
    if (_.isNumber(params.limit) && params.limit > 0) q.limit = params.limit;

    if (isCounting) return this.model.count(q);

    return this.model.findAll(q).then((items) => {
       (items.map((item) => item.dataValues));
      return items;
    });
  }

  transformSort(paramSort: string[]) {
    let sort = paramSort;
    if (_.isString(sort)) sort = sort.replace(/,/, " ").split(" ");

    if (Array.isArray(sort)) {
      let sortObj = [];
      sort.forEach((s) => {
        if (s.startsWith("-")) sortObj.push([s.slice(1), "DESC"]);
        else sortObj.push([s, "ASC"]);
      });
      return sortObj;
    }

    if (_.isObject(sort)) {
      return Object.keys(sort).map((name) => [
        name,
        sort[name] > 0 ? "ASC" : "DESC",
      ]);
    }

    /* istanbul ignore next*/
    return [];
  }

  beforeSaveTransformID(entity: T) {
    return entity;
  }

  afterRetrieveTransformID(entity: T) {
    return entity;
  }
}

export interface Filter {
  search?: string;
  searchFields?: string[];
  query?: any;
  sort?: string[];
  limit?: number;
  offset?: number;
}

export interface SequelizeDbAdapterProps<T extends BaseModel>{
  db: SequelizeModel;
  model: ModelCtor<Result<T>>;
}

export interface Result<T extends BaseModel> extends ModelSequelize<any, any> {
  dataValues: T;
}

module.exports = SequelizeDbAdapter;
