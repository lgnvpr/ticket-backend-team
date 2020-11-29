import {localConfig} from "../config/LocalConfig";
import { Car } from "server/base-ticket-team/base-carOwner/Car";
import { Customer } from "server/base-ticket-team/base-carOwner/Customer";
import { PositionStaff } from "server/base-ticket-team/base-carOwner/PositionStaff";
import { Route } from "server/base-ticket-team/base-carOwner/Route";
import { Staff } from "server/base-ticket-team/base-carOwner/Staff";
import { serviceName } from "@Core/query/NameService";
import { MongoService } from "./ConnectDbMigration";
import * as data from "./DataExample"
import { ChairCar } from "@Core/base-carOwner/ChairCar";
const { v4: uuidv4 } = require('uuid');
console.log("Staff Migration ................")
export enum Status {
    active = "active",
    deleted = "deleted",
}
create();

async function create() {

    try {
        await MongoService.connect(localConfig.URLDb);
        console.info('Connected to Mongo.');

        let namePosition = data.position;
        let listPosition: PositionStaff[] = [];
        for (let i = 0; i < namePosition.length; i++) {
            const position: PositionStaff = {
                _id: uuidv4(),
                name: namePosition[i],
                description: "This a position"
            }
            listPosition.push(position)
            await MongoService._create(serviceName.position, position);
        }
        

        let listName: string[] = data.name;
        let listStaff: Staff[] = [];
        for (let i = 0; i < listName.length; i++) {
            const staff: Staff = {
                _id: uuidv4(),
                address: data.Country[Math.floor(Math.random() * data.Country.length)],
                birthAt: data.randomBirthDay(),
                status: Status.active,
                identityCard: data.randomCmnd(),
                name: listName[i],
                phoneNumber : data.randomPhone(),
                sex: data.randomSex(),
                createAt: new Date(),
                updateAt: new Date,
                positionId: listPosition[Math.floor(Math.random() * listPosition.length - 2)]?._id
            }
            await MongoService._create(serviceName.staff, staff);
            listStaff.push(staff)
        }
        
        
        let listCar: Car[] = [];
        for (let i = 0; i < 20; i++) {
            const car: Car ={
                _id: uuidv4(),
                createAt: new Date(),
                description: "No description",
                entryAt: data.randomBirthDay(),
                licensePlates: data.radomLicensePlates(),
                name: `Ale team ${i+1}`,
                origin: data.country[Math.floor(Math.random() * data.country.length)],
                status: Status.active,
                updateAt: new Date(),
                statusCar: "using",

            } 
            await MongoService._create(serviceName.car, car);
            listCar.push(car)
        }

        let listCustomer : Customer[] = []
        for (let i = 0; i < listName.length; i++) {
            const customer: Customer = {
                _id : uuidv4(),
                birthAt: data.randomBirthDay(),
                CMND: data.randomCmnd(),
                createAt: new Date(),
                description: "Customer",
                email: "lgnvpr@gmail.com",
                name: listName[i],
                sex: data.randomSex(),
                status: Status.active,
                phoneNumber: data.randomPhone(),
                updateAt : new Date()
            }
            await MongoService._create(serviceName.customer, customer);
            listCustomer.push(customer)
            
        }

 
        let listRoute: Route[] = []
        for (let i = 0; i < 20; i++) {
            let end = data.Country[Math.floor(Math.random() * data.Country.length)];
            const route : Route = {
                _id: uuidv4(),
                localEnd: data.Country[Math.floor(Math.random() * data.Country.length)], 
                localStart : data.Country[Math.floor(Math.random() * data.Country.length)],
                sumTimeRun: Math.floor(Math.random() * 10 + 5),
                startAt: data.randomHourAndMinute()
            
            }
            listRoute.push(route)            
            await MongoService._create(serviceName.route,route );
        }
        
        const account = {
                staffId : listStaff[0]._id,
                username : "luong",
                password : "123123",
        }

        for (let i = 0; i < listCar.length; i++) {
            const chair = {
                floor: 2,
                row: 10,
                column: 4,
                carId : listCar[i]._id
            } 
            let listChair: Array<any> = new Array();
            for (let fl = 1; fl <= chair.floor; fl++) {
            for (let rw = 1; rw <= chair.row; rw++) {
                for (let cl = 1; cl <= chair.column; cl++) {
                    let getColumn = 0;
                    if(chair.column ==1) getColumn =3; 
                    if(chair.column ==2) getColumn = (cl-1) *4 +1;
                    if(chair.column ==3) getColumn = Math.floor(cl*1.9);
                    (chair.column ==4 && cl >=3)  ? getColumn = cl+1 : getColumn = cl;
                    if(chair.column ==5 ) getColumn = chair.column;

                    let newChair: ChairCar = {
                        carId: chair.carId,
                        name: MongoService.codeChair(fl, chair.column, rw),
                        localColumn: getColumn,
                        localRow: rw,
                        localFloor: fl,
                    }
                    listChair.push(newChair);
                }
            }
            }
            await MongoService._create(serviceName.chairCar,listChair );   
        }
    } catch (err) {
        console.log(err);
    }
}

