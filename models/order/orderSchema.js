import mongoose from "mongoose"

const ItemSchema = new mongoose.Schema({
     _id : {
         type : mongoose.Schema.Types.ObjectId,
         ref : "Product",
         required : [true,"Product id is required"]
     },
     quantity : {
         type : Number,
         min : [1, "quantity must be minumum 1"]
     },
     price : {
         type : Number,
         required : [true , "item Price is required"]
     },
     discount : { 
        type : Number
     }
})

const orderSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : [true , "user is required"]
    },
    items : {
        type : [ItemSchema],
        required : true,
        validate : {
            validator : (items)=>items.length > 0,
            message : "no products"
        }
    },
    shippingAddress : {
        street : {
            type : String,
            required : [true,"street is required"]
        },
        city : {
            type : String,
            required : [true,"city is required"]
        },
        country : {
            type : String,
            required : [true,"Country is required"]
        },
        postCode : {
            type : String,
            required : [true,"Postal Code is required"]
        }
    },
    paymentMethod : {
        type : String,
        required : [true,"Payment Method is required"],
        enum : {values : ["payPal","creditCard","cash"],message: 'paymentMethod must be only credit Card , payPal or cash'}
        
    },
    isDelivered : {
        type : Boolean, 
        default : false
    },
    paidAt : {
        type : Date, 
    },
    deliveredAt : {
        type : Date, 
    },
    isPaid : {
        type : Boolean,
        default : false
    },
    taxPrice : {
        type : Number,
        required : true
    },
    itemsPrice : {
        type : Number,
        required : true
    },
    shippingPrice : {
        type : Number,
        required : true
    },
    comment : {
        type : String,
        maxlength : [100,"comment must be maximum 100 characters"]
    }
   

},
{
    timestamps : true
})
 

export const orderModel = mongoose.models.order || mongoose.model("order",orderSchema)