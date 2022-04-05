import {productModel} from "./productsSchema"
import {createValidationError , createMongoDbServerError} from "../../utilities/MongodbErrors/MongoDBErrors"


export async function getAllProducts(){
    return await productModel.find({})
}

export function addProduct(doc){
     
    const product = new productModel(doc)
    // eslint-disable-next-line no-undef
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


export async function getTopProducts (page , pageSize){
    if(typeof page !== "number") throw new Error("page must be a number")
    if(typeof pageSize !== "number") throw new Error("page must be a number")

    return await productModel.find({
        "rating" : {"$gte" : 3.5}
    },{},{limit : pageSize,skip : page * pageSize , sort : {"createdAt" : -1} }).lean()
    
}

export async function getProductBySlugName(slugName){
    if(typeof slugName !== "string" ) throw new Error("slugName must be string")

    return await productModel.findOne({slugName : slugName})

}