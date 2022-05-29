import {orderModel} from "./orderSchema";
import {productModel} from "../products/productsSchema";
import {UserModel} from '../users/usersSchema';
import {createValidationError , createMongoDbServerError} from "../../utilities/Errors/MongodbErrors/MongoDBErrors";
  
export function addOrder(doc){
    const product = new orderModel(doc) 
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


export async function getOrderById(id,options = {populateUser : true,populateItems : false}){
    try{
        console.log(options)
        const query = orderModel.findById(id).populate("user",{"__v" : 0},UserModel)
         
        if(options.populateItems) 
            query.populate({
                path : "items", 
                populate: { 
                    path: '_id', 
                    model : productModel, 
                    select : {image : 1,discount : 1 , price : 1,slugName : 1,name : 1 , _id : 1}
                }
            })
        const docs = await query.lean(); 
        if(!docs) return Promise.reject({name : "ORDER_NOT_FOUND"})
        
        return docs;
    }catch(err){ 
        console.log(err) 
        return Promise.reject({name : err.name , message : err.message})
    }    
}

export function updateOrder(id,updatedDoc) { 

    return new Promise((resolve , reject)=>{ 

        orderModel.findByIdAndUpdate(id,updatedDoc,(err)=>{
            if(err){ 
                if(err.name === 'ValidationError') return reject(createValidationError(err))
                if(err.name === "MongoServerError") return reject(createMongoDbServerError(err))
                return reject(err) 
            } 

            resolve(true)

         })
    })
    
}

export async function getOrders(filter , page , pageSize){
    return  await orderModel.find(
        filter
    ,{},{limit : pageSize,skip : page * pageSize , sort : {"createdAt" : -1}}).lean()
}

export async function deleteOrderById(id){
    if(typeof id !== "string" && typeof id !== "number") throw new Error("id must be a string or a number")

    return new Promise((resolve , reject)=>{
 
        orderModel.findByIdAndDelete(id,(err,doc)=>{
            if(err){
                if(err.name === "MongoServerError") return reject(createMongoDbServerError(err))
                if(err.name === "CastError") return reject({errro : "Casting error happened"})
                return reject(err)
            }
  
            resolve(doc)
        })

    })
}