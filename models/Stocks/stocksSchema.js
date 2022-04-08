import mongoose from "mongoose"

export const StockSchema = new mongoose.Schema({
    stockName : {
        type : String,
        required : [true , "Stock name must be specified"]
    },
    product_ID : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Product'
    },
    countInStock : {
        type : Number,
        default : 0
    },
    branchAddress : {
        type : String
    }
},{_id : false})


export const stockModel = mongoose.models.stock || mongoose.model("stock",StockSchema)