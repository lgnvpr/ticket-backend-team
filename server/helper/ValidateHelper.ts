import * as Joi from 'joi';
import { AleError } from 'server/common/AleError';
export class ValidateHelper{
    public static validateJoi<T>(schema : Joi.Schema, data: T): T{
        var check =schema.validate(data);
        if(check.error || check.errors){
            throw AleError.badInput(check.error.message)

        }
        return check.value
    }
}