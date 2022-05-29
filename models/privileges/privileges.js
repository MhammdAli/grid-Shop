import {privilegesModel} from "./privilegesSchema";
import {createValidationError , createMongoDbServerError} from "../../utilities/Errors/MongodbErrors/MongoDBErrors";
import {UserModel} from "../users/usersSchema"; 
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



export async function grantUserPrivilages(id,privileges){
    if(typeof id !== "string" && typeof id !== "number") throw new Error("id must be a string or a number")
    if(!Array.isArray(privileges)) throw new Error("privileges must be a object")
    
    return new Promise((resolve , reject)=>{

       UserModel.findByIdAndUpdate(id,{"$addToSet" : {"roles" : {"$each" : privileges}}},{runValidators : true},function(err,result){

           if(err){ 
               if(err.name === 'ValidationError') return reject(createValidationError(err))
               if(err.name === "MongoServerError") return reject(createMongoDbServerError(err))
               if(err.name === "CastError") return reject({err : "Casting error"})
               return reject(err)
           }
           
           resolve(result)
           
       })

    })
}

export async function RevokeUserPrivilages(id,privileges){
    if(typeof id !== "string" && typeof id !== "number") throw new Error("id must be a string or a number")
    if(!Array.isArray(privileges)) throw new Error("privileges must be a object")
    
    return new Promise((resolve , reject)=>{

       UserModel.findByIdAndUpdate(id,{"$pull" : {"roles" : {"$in" : privileges}}},{runValidators : true},function(err,result){

           if(err){ 
               if(err.name === 'ValidationError') return reject(createValidationError(err))
               if(err.name === "MongoServerError") return reject(createMongoDbServerError(err))
               if(err.name === "CastError") return reject({err : "Casting error"})
               return reject(err)
           }
           
           resolve(result)
           
       })

    })
}