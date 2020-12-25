import { PositionDefault } from "@Core/base-carOwner/PositionDefault";
import { PositionStaff } from "@Core/base-carOwner/PositionStaff";

export const dataPosition:PositionStaff[] = [
    {
        name : "Driver",
        description : "driver",
        keyDefault : PositionDefault.drive,
    },
    {
        name : "Sale",
        description : "sale",
        keyDefault : PositionDefault.staffSale,
    },
    {
        name : "Boss",
        description :"Boss",
        keyDefault : PositionDefault.boss,
    },
    {
        name : "Cashier",
        description : "thu ngân"
    },
    {
        name : "Manager",
        description : "manager"
    },
    {
        name : "Cleaning Staff",
        description : "Cleaning Staff"
    },

]