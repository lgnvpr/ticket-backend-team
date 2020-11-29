import { v4 as uuidv4 } from 'uuid';
import * as mongodb from "mongodb";

export class MongoService{
    public static client : mongodb.MongoClient;

    public static connect(url : string){
        return new Promise((resolve, reject) =>{
            mongodb.MongoClient.connect(url, {useNewUrlParser : true,useUnifiedTopology: true}, (err, client: mongodb.MongoClient) =>{
                if(err){
                    reject(err);
                }else {
                    MongoService.client = client;
                    resolve(client);
                }
            })
        });
    }
    
    public static collection(collection: string): any {
        return MongoService.client.db("ticket").collection(collection);
    }

    public static async _create(collection, data): Promise<any> {
        let params: any = data
        console.log("\x1b[31m", `============Create for ${collection}====================`);
        if (Array.isArray(params)) {
            params.map((params) => {
                params.status = "active",
                    params.createAt = new Date();
                params._id = uuidv4()
                params.updateAt = new Date();
                params.updateBy = "";
                params.createBy = "";
                return params;
            })
            return this.collection(collection).insertMany(params)
                .then(res => { console.log(res); return res })
                .catch(err => err);
        }
        let customParams: any = { ...params, status: "active", updateAt: new Date(), updateBy: "" }
        

        customParams.createAt = new Date();
        customParams.createBy = "";
        if(!customParams._id){
            customParams._id = uuidv4();
        }
        return this.collection(collection).insert(customParams)
            .then(res => {console.log(res);return customParams})
            .catch(err => err);
    }   

    public static codeChair(fl: number, column: number, rw : number) {
        let getNameFloor = fl == 1 ? "L" : "D"
        let getNameCollum = column == 1 ? "A" : column == 2 ? "B" : column == 3 ? "C" : column == 4 ? "D" : "E"
        return `${getNameFloor} ${rw}${getNameCollum}`
        
    }
}