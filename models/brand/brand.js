import {Brand} from "./brandSchema";
import {createValidationError , createMongoDbServerError} from "../../utilities/Errors/MongodbErrors/MongoDBErrors";

/*
* This function is used to add a brand
* @return 
*  1) resolve the inserted document
*  2) reject a validation error , mongodbServer error or casting error so all these errors will be distinguished by field type 
* @params
*  1) doc of type object to insert it to mongoDB
*
*/
export function addBrand(doc){
    const brand = new Brand(doc) 
    return new Promise((resolve , reject)=>{  
        brand.save((err,doc)=>{ 
            if(err){
                if(err.name === 'ValidationError') return reject(createValidationError(err))
                if(err.name === "MongoServerError") return reject(createMongoDbServerError(err))
                return reject(err) 
            }
   
            resolve(doc)
       })
    })
}

export async function getAllBrands(){
    return await Brand.find({}).lean()
}
