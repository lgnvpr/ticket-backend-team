"use strict";

const _ = require("lodash");
const { ServiceSchemaError } = require("moleculer").Errors;
const mongodb = require("mongodb");
const ObjectID = mongodb.ObjectID;
import { BaseModel, Status } from "@Core/query/BaseModel";
import { ServiceBroker, Service as MoleculerService } from "moleculer";
import { Collection, MongoClient, Db, OptionalId } from "mongodb";

class MongoDbAdapter<T extends BaseModel> {
  uri: string;
  opts: any;
  dbName: string;
  broker: ServiceBroker;
  service: MoleculerService;
  client: MongoClient;
  db: Db;
  collection: Collection<T>;

  constructor(uri: string, opts: any, dbName: string) {
    (this.uri = uri), (this.opts = opts);
    this.dbName = dbName;
  }

  init(broker: ServiceBroker, service: MoleculerService) {
    this.broker = broker;
    this.service = service;

    if (!this.service.schema.collection) {
      /* istanbul ignore next */
      throw new ServiceSchemaError(
        "Missing `collection` definition in schema of service!"
      );
    }
  }

  connect() {
    this.client = new MongoClient(this.uri, this.opts);
    return this.client.connect().then(() => {
      this.db = this.client.db(this.dbName);
      this.collection = this.db.collection(this.service.schema.collection);

      this.service.logger.info("MongoDB adapter has connected successfully.");

      /* istanbul ignore next */
      this.db.on("close", () =>
        this.service.logger.warn("MongoDB adapter has disconnected.")
      );
      this.db.on("error", (err) =>
        this.service.logger.error("MongoDB error.", err)
      );
      this.db.on("reconnect", () =>
        this.service.logger.info("MongoDB adapter has reconnected.")
      );
    });
  }

  disconnect() {
    if (this.client) {
      this.client.close();
    }
    return Promise.resolve();
  }

  find(filters) {
    return this.createCursor(filters, false).toArray();
  }

  findOne(query) {
    return this.collection.findOne(query).then((item) => {
      if (item.status !== Status.active) return null;
      return item;
    });
  }

  findById(_id) {
    return this.collection
      .findOne({ _id: this.stringToObjectID(_id) })
      .then((item) => {
        if (item.status !== Status.active) return null;
        return item;
      });
  }

  findByIds(idList) {
    return this.collection
      .find({
        _id: {
          $in: idList.map((id) => this.stringToObjectID(id)),
        },
      })
      .toArray();
  }

  count(filters = {}) {
    return this.createCursor(filters, true);
  }

  insert(entity: OptionalId<T>) {
    return this.collection.insertOne(entity).then((res) => {
      if (res.insertedCount > 0) return res.ops[0];
    });
  }

  insertMany(entities: OptionalId<T>[]) {
    return this.collection.insertMany(entities).then((res) => res.ops);
  }

  updateMany(query, update) {
    return this.collection
      .updateMany(query, update)
      .then((res) => res.modifiedCount);
  }

  updateById(_id: string, update) {
    return this.collection
      .findOneAndUpdate({ _id: this.stringToObjectID(_id) }, update, {
        returnOriginal: false,
      })
      .then((res) => res.value);
  }

  removeMany(query: any) {
    return this.collection.deleteMany(query).then((res) => res.deletedCount);
  }

  removeById(_id: string) {
    return this.collection
      .findOneAndDelete({ _id: this.stringToObjectID(_id) })
      .then((res) => res.value);
  }

  clear() {
    return this.collection.deleteMany({}).then((res) => res.deletedCount);
  }
  entityToObject(entity) {
    let json = Object.assign({}, entity);
    if (entity._id) json._id = this.objectIDToString(entity._id);
    return json;
  }

  createCursor(params, isCounting) {
    const fn = isCounting
      ? this.collection.countDocuments
      : this.collection.find;
    let q;
    if (params) {
      // Full-text search
      // More info: https://docs.mongodb.com/manual/reference/operator/query/text/
      if (_.isString(params.search) && params.search !== "") {
        q = fn.call(
          this.collection,
          Object.assign(params.query || {}, {
            $text: {
              $search: params.search,
            },
          })
        );

        if (q.project && !isCounting)
          q.project({ _score: { $meta: "textScore" } });

        if (q.sort && !isCounting) {
          q.sort({
            _score: {
              $meta: "textScore",
            },
          });
        }
      } else {
        q = fn.call(this.collection, params.query);

        // Sort
        if (params.sort && q.sort) {
          let sort = this.transformSort(params.sort);
          if (sort) q.sort(sort);
        }
      }

      // Offset
      if (_.isNumber(params.offset) && params.offset > 0) q.skip(params.offset);

      // Limit
      if (_.isNumber(params.limit) && params.limit > 0) q.limit(params.limit);

      return q;
    }

    // If not params
    return fn.call(this.collection, {});
  }

  transformSort(paramSort) {
    let sort = paramSort;
    if (_.isString(sort)) sort = sort.replace(/,/, " ").split(" ");

    if (Array.isArray(sort)) {
      let sortObj = {};
      sort.forEach((s) => {
        if (s.startsWith("-")) sortObj[s.slice(1)] = -1;
        else sortObj[s] = 1;
      });
      return sortObj;
    }

    return sort;
  }

  stringToObjectID(id) {
    if (typeof id == "string" && ObjectID.isValid(id))
      return new ObjectID.createFromHexString(id);

    return id;
  }

  objectIDToString(id) {
    if (id && id.toHexString) return id.toHexString();

    return id;
  }

  beforeSaveTransformID(entity, idField) {
    let newEntity = _.cloneDeep(entity);

    if (idField !== "_id" && entity[idField] !== undefined) {
      newEntity._id = this.stringToObjectID(newEntity[idField]);
      delete newEntity[idField];
    }

    return newEntity;
  }

  afterRetrieveTransformID(entity, idField) {
    if (idField !== "_id") {
      entity[idField] = this.objectIDToString(entity["_id"]);
      delete entity._id;
    }
    return entity;
  }
}

export interface MongoDbAdapterProps<T extends BaseModel> {
  db: Db;
  collection: Collection<T>;
}

module.exports = MongoDbAdapter;
