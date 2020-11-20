/* eslint-disable camelcase */
/* eslint-disable max-len */
"use strict";
import  MongoBaseService  from "@Service/MongoBaseService";
import { Service as MoleculerService, Context } from "moleculer";
import { Action, Method, Service } from "moleculer-decorators";
const MongoDBAdapter = require("moleculer-db-adapter-mongo");
const DbService = require("moleculer-db");



@Service({
  name: "asyncDentally",
  mixins : [DbService],
  adapter : new MongoDBAdapter("mongodb://localhost:27017", "risk","flymed"),
  settings: {
    "aaa" : "ađsa"
  },
  collection : "risk"
  
})
class FlyCommandService extends MongoBaseService {
  
  @Action()
  public create(ctx: Context){
    return this._customCreate(ctx, ctx.params);
  }
  
  @Action()
  public list(ctx: Context){
    return this._customList(ctx, ctx.params);
  }
  




}

module.exports = FlyCommandService;
