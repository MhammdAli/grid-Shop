import {UserModel} from "./usersSchema";
import {createValidationError , createMongoDbServerError} from "../../utilities/Errors/MongodbErrors/MongoDBErrors";

/*
* This function is used to createUser a new User
* @return 
*  1) resolve the inserted document + it will return the converted Plain old Java object
*  2) reject a validation error , mongodbServer error or casting error so all these errors will be distinguished by field type 
* @params
*  1) doc of type object to insert it to mongoDB
*
*/
export function createUser(doc){ 
    const user = new UserModel(doc)  
    return new Promise((resolve , reject)=>{
        user.save(function (err,doc){
           
            if(err){   
                if(err.name === 'ValidationError') return reject(createValidationError(err))
                if(err.name === "MongoServerError") return reject(createMongoDbServerError(err))
                return reject(err)
            } 
            
            doc = doc?.toObject()
            delete doc?.password  

            return resolve(doc)
        })
    })
}

/*
* This function is used to update a user at specific id so it return a promise
* @return 
*  1) resolve a boolean true if there a change happens in the document otherwise no change
*  2) reject a validation error , mongodbServer error or casting error so all these errors will be distinguished by field type 
* @params
*  1) id  the id is used to update a document  
*  2) doc is used to update the document in database at specific id
*
*/
export function updateById(id,doc){
     if(typeof id !== "string" && typeof id !== "number") throw new Error("id must be a string or a number")
     if(typeof doc !== "object") throw new Error("doc must be a object")
     
     return new Promise((resolve , reject)=>{
 
        UserModel.findByIdAndUpdate(id,{"$set" : doc},{runValidators : true},function(err,result){

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

/*
* This function is used to delete a user at specific id
* @return 
*  1) resolve a deleted user document
*  2) reject a validation error , mongodbServer error or casting error so all these errors will be distinguished by field type 
* @params
*  1) id  the id is used to delete a document from mongoDB   
*
*/
export function deleteUser(id){
    if(typeof id !== "string" && typeof id !== "number") throw new Error("id must be a string or a number")

    return new Promise((resolve , reject)=>{
 
        UserModel.findByIdAndDelete(id,(err,doc)=>{
            if(err){
                if(err.name === "MongoServerError") return reject(createMongoDbServerError(err))
                if(err.name === "CastError") return reject({errro : "Casting error happened"})
                return reject(err)
            }
 
            // doc will return docment with password this is a problem so solve it with omit it will not work
            resolve(doc)
        })

    })
}

/*
* This function is used to get User By Id
* @return 
*  1) resolve a boolean true if there a change happens in the document otherwise no change
*  2) reject a validation error , mongodbServer error or casting error so all these errors will be distinguished by field type 
* @params
*  1) id of type number and is used to search specific user by id 
*
*/
export async function getUserById(id){
    if(typeof id !== "string" && typeof id !== "number") throw new Error("id must be a string or a number")
    return await UserModel.findById(id,{__v : 0}).lean()
}  


/*
* This function is used to get User By Email it will return jsut some specific fields in order to used it for tokens purpose
* @return 
*  1) resolve a matched document otherwise null (#if no match)
*  2) reject  
* @params
*  1) email  the email is used to get the document   
*/
export async function getUserByEmail(email){
    if(typeof email !== "string") throw new Error("email must be a string")
    return await UserModel.findOne({email} , {password : 1,firstName : 1,lastName : 1 , imageUrl:1,isAdmin : 1 , roles : 1}).lean()
}


export async function getUsers(filter,page , pageSize){
    return  await UserModel.find(
        filter
    ,{},{limit : pageSize,skip : page * pageSize}).lean()
}
 
export async function updateUserPrivilages(id,privileges){
    if(typeof id !== "string" && typeof id !== "number") throw new Error("id must be a string or a number")
    if(!Array.isArray(privileges)) throw new Error("privileges must be a object")
    
    return new Promise((resolve , reject)=>{

       UserModel.findByIdAndUpdate(id,{"$set" : {"roles" : privileges}},{runValidators : true},function(err,result){

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