import {UserModel} from "./usersSchema"
import {createValidationError , createMongoDbServerError} from "../../utilities/MongodbErrors/MongoDBErrors"

function omit(doc , fields){
    
    if(!Array.isArray(fields) && typeof fields !== "string") throw new Error("fileds param must be array or string")
    if(typeof doc !== "object") throw new Error("doc param must be a object")
    
    // convert filds to array if it is string
    if(fields === "string") fields = [fields]

    fields.forEach(field=>{
        delete doc[field]
    })
    
    return doc

}

 
// 1) how to omit doc (password) from save method and resolve the non omited object to the user
export function createUser(doc){ 
    const user = new UserModel(doc) 
    return new Promise((resolve , reject)=>{
        user.save(function (err,doc){
           
            if(err){   
                if(err.name === 'ValidationError') return reject(createValidationError(err))
                if(err.name === "MongoServerError") return reject(createMongoDbServerError(err))
                return reject(err)
            } 
 
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

        UserModel.updateOne({_id : id},{"$set" : doc},{runValidators : true},function(err,result){

            if(err){ 
                if(err.name === 'ValidationError') return reject(createValidationError(err))
                if(err.name === "MongoServerError") return reject(createMongoDbServerError(err))
                if(err.name === "CastError") return reject({errro : "Casting error happened"})
                return reject(err)
            }
 
            resolve(result.acknowledged && result.modifiedCount > 0 )

        })

     })
}

// must update it to solve casting errors because it is not a good pratice 
export async function getUserById(id){
    if(typeof id !== "string" && typeof id !== "number") throw new Error("id must be a string or a number")
    return await UserModel.findById(id,{__v : 0})
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
    return await UserModel.findOne({email} , {password : 1,firstName : 1,lastName : 1 , imageUrl:1})
}


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
