import mongoose from "mongoose"
 
const StockSchema = new mongoose.Schema({
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
        min : [1,'count stock must be greater then 0']
    },
    branchAddress : {
        type : String
    }
},{_id : false})

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
    category : {
        main : {
        type : String,
        required : [true,"Main Category is required"]
    },
    sub : {
        type : String
    }
    },
    image : {
        type : String,
        required : [true,"image is required"]
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
    numReviews : {
        type : Number, 
        default : 0
    },
    stocks : [StockSchema],
    description : {
        type : String,
        required : [true,"description Name is required"],
        minlength : [30 , "description must be minimum 30 characters"],
        maxlength : [500]
    },
    ItemDetails : {
        type : [String],
        validate : [{
            validator : (values)=>{  
                return values.length >= 1 && values.length <= 6
            },
            message : 'ItemDetails must be min 1 and max 6 items',
            "path" : "item"
           },
           {
            validator : (values)=>{ 
                return values.every((value)=>value.length >=20 && value.length <=200)
            },
            message : 'ItemDetail must be between 20 and 200 character'
           }
        ]
    }
},{
    timestamps: true,
})

productSchema.index({createdAt : -1})

export const productModel = mongoose.models.Product || mongoose.model("Product",productSchema)
