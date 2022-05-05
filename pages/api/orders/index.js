import {handler} from "../../../middlewares/errorMiddlewares"
import { connect, disconnect  } from "../../../config/dbConn"
import {addOrder, getOrders} from "../../../models/order/order" 
import {validate} from "../../../utilities/Validation"
import { productModel } from "../../../models/products/productsSchema"
import  {isAuth} from "../../../utilities/tokens_utilities" 
import {handleDateOperator, handleNumbersOperator} from "../../../utilities/mongoOperators"
handler.use(isAuth())
handler.post(async (req,res)=>{ 
 
    const {
      products,
      paymentMethod,
      shippingAddress,
      comment
  } = req.body
  
  if(!Array.isArray(products)) return res.status(405).json({name : "PRODUCT_MUST_BE_ARRAY"})
  
  await connect()
  
  const getProductIds = products.reduce((agg,{_id})=>{
     if(_id)
       agg.push(_id)
     return agg
  },[])
  
  
  const myProducts = await productModel.find({"_id" : {$in : getProductIds}},{price : 1,discount : 1}).lean()
  
  if(myProducts.length <= 0) return res.json({name : "NO_PRODUCT",type : "ERROR"})
  
  let totalQuantity=0
  let itemsPrice = 0
  var reduceProduct = myProducts.map((product)=>{ 
     const quantity = products.find(({_id})=>_id === product._id.toString())?.quantity || 0;
     itemsPrice += product.price * quantity
     totalQuantity += quantity
     return {
           ...product,
           quantity 
       }
     
  })
  
  reduceProduct = {
    items : reduceProduct,
    totalQuantity,
    itemsPrice,
    paymentMethod,
    shippingAddress,
    user : req.user.UID,
    shippingPrice : totalQuantity > 200 ? 0 : totalQuantity * .15,
    taxPrice : 0,
    comment
  }
  
  try{
   const addedOrder = await addOrder(reduceProduct)
   res.json({orderId : addedOrder._id , type :"SUCCESS" })  
  }catch(error){ 
   res.json({error, type : "ERROR"})
  }
  
  
  await disconnect()
  
  })

 
handler.use(validate({
    page : { 
        required : [true,"page is required"],
        match : {
            validator : (page)=>parseInt(page) >= 0,
            message : "page must be greater or equal than 0"
        }
    },
    pageSize : {  
        default : 20,
        match : {
            validator : (pageSize)=>pageSize >0 && pageSize <=100,
            message : "page Size must be between 1 and 100"
        }
    },
    isPaid : {
        path : "isPaid",
    },
    isDelivered : {
        path : "isDelivered", 
    },
    createdAt : {
        path : "createdAt",
        calculated : (field , operator , value)=>{
            return handleDateOperator("createdAt",operator,value)
        }
    },
    price : {
        path : "itemsPrice",
        calculated : (field , operator , value)=>{ 
            return {"itemsPrice" : handleNumbersOperator(operator,value)}
        }
    },
    shippingPrice : {
        path : "shippingPrice",
        calculated : (field , operator , value)=>{ 
            return {"shippingPrice" : handleNumbersOperator(operator,value)}
        }
    }
    
}))

 
handler.get(async (req,res)=>{  
    
    if(req.result.type === "ERROR") return res.json(req.result)
  
    const {
        page ,
        pageSize
    } = req.query 

    await connect() 
    try{ 
       const result = await getOrders(req.result.search,page , pageSize)
       res.json({result})
    }catch(error){
        console.log(error)
        res.json({error})
    }
 
})

export default handler;