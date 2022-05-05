import {productModel} from "./productsSchema";
import {createValidationError , createMongoDbServerError} from "../../utilities/Errors/MongodbErrors/MongoDBErrors";

/*
* This function is used to add a product
* @return 
*  1) resolve the inserted document
*  2) reject a validation error , mongodbServer error or casting error so all these errors will be distinguished by field type 
* @params
*  1) doc of type object to insert it to mongoDB
*
*/
export function addProduct(doc){
    const product = new productModel(doc) 
    return new Promise((resolve , reject)=>{  
        product.save((err,doc)=>{ 
            if(err){
                if(err.name === 'ValidationError') return reject(createValidationError(err))
                if(err.name === "MongoServerError") return reject(createMongoDbServerError(err))
                return reject(err) 
            }
   
            resolve(doc)
       })
    })
}

/*
* This function is used to get Top Products by using latest rating products greater than 3.5 
* @return 
*  1) resolve the inserted document
*  2) reject a validation error , mongodbServer error or casting error so all these errors will be distinguished by field type 
* @params
*  1) page of type number is used to return the specific page
*  2) pageSize of type number is used to limit document that are returned 
*/
export async function getTopProducts (page , pageSize){
    if(typeof page !== "number") throw new Error("page must be a number")
    if(typeof pageSize !== "number") throw new Error("page must be a number")
    return  await productModel.find({
        "rating" : {"$gte" : 3.5}
    },{},{limit : pageSize,skip : page * pageSize , sort : {"createdAt" : -1} }).lean()
}

/*
* This function is used to get specific product by using slugName 
* @params
*  1) slugName of type string is used to return the specific slugName
*/
export async function getProductBySlugName(slugName){
    if(typeof slugName !== "string" ) throw new Error("slugName must be string")
    return await productModel.findOne({slugName : slugName}).lean() 
}


export async function getAllProducts(filter , page , pageSize){
    return  await productModel.find(
        filter
    ,{},{limit : pageSize,skip : page * pageSize , sort : {"createdAt" : -1}}).lean()
}
