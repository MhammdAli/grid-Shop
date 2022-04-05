import mongoose from "mongoose"
import { StockSchema } from "../Stocks/stocksSchema"


const CategorySchema = new mongoose.Schema({
    main : {
        type : String,
        required : [true,"Main Category is required"]
    },
    sub : {
        type : String
    }
    
},{"_id" : false})

 
const productSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    slugName : {
        type : String,
        required : [true,"Slug Name is required"], 
        unique : true
    },
    category : CategorySchema,
    image : {
        type : String,
        required : [true,"image Name is required"]
    },
    price : {
        type : Number,
        required : [true,"price Name is required"]
    },
    discount : {
        type : Number,
        default : 0
    },
    brand : {
        type : String,
        required : [true,"barnd Name is required"]
    },
    rating : {
        type : Number, 
        default : 0,
        min:[0,"Rating must be min 0 , you got {VALUE}"],
        max:[5,"Rating must be max 5 , you got {VALUE}"] 
    },
    numReviews : {
        type : Number, 
        default : 0
    },
    stocks : {
         type : [StockSchema], 
    },
    description : {
        type : String,
        required : [true,"description Name is required"],
        minlength : [30 , "description must be minimum 30 characters"],
        maxlength : [500]
    },
},{
    timestamps: true,
})

productSchema.index({createdAt : -1})

export const productModel = mongoose.models.Product || mongoose.model("Product",productSchema)
