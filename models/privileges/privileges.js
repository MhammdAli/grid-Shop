import {privilegesModel} from "./privilegesSchema";
import {createValidationError , createMongoDbServerError} from "../../utilities/Errors/MongodbErrors/MongoDBErrors";

/*
* This function is used to add a category
* @return 
*  1) resolve the inserted document
*  2) reject a validation error , mongodbServer error or casting error so all these errors will be distinguished by field type 
* @params
*  1) doc of type object to insert it to mongoDB
*
*/
export function addPrivilege(doc){
    const privileges = new privilegesModel(doc) 
    return new Promise((resolve , reject)=>{  
        privileges.save((err,doc)=>{ 
            if(err){
                if(err.name === 'ValidationError') return reject(createValidationError(err))
                if(err.name === "MongoServerError") return reject(createMongoDbServerError(err))
                return reject(err) 
            }
   
            resolve(doc)
       })
    })
}

export async function getAllPrivileges(){
    return await privilegesModel.find({}).lean()
}
