import { BaseModel } from "@Core/query/BaseModel";
import { BaseService } from "../BaseService";
import { MongoDbAdapterProps } from "./MongoDbAdapter";

export class BaseServiceWithMongo<T extends BaseModel> extends BaseService<T> {
  adapter: MongoDbAdapterProps<T>;
}
