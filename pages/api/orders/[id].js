// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {connect,disconnect} from "../../../config/dbConn"
import { deleteOrderById, getOrderById, updateOrder}  from "../../../models/order/order"
import  {isAuth} from "../../../utilities/tokens_utilities"  
import { QUERY, validate } from "../../../utilities/Validation"
import nc from "next-connect";
import {NoMatchEndpoint,errorHandler} from "../../../middlewares/errorMiddlewares"

const handler = nc({
    onNoMatch : NoMatchEndpoint,
    onError : errorHandler
})



handler.use(isAuth())
 
handler.get(async (req,res)=>{ 
 
  const {
       id
  } = req.query 

  await connect()  
  try{
    const order = await getOrderById(id,{populateItems : true})
     
    if(order.user && (order.user.toString() === req.user.UID || req.user.isAdmin) ) res.json({order})

    else res.status(405).json({name : "NOPERMISSION",message : "you dont have permission to call this api"})

  }catch(err){  
     res.json(err)
  }
    
  await disconnect()
  
});


 
 

handler.use(validate({
    id : {
      match : {
        validator : function(){
            return this.isAdmin  
        },
        message : "no permission to call this api"
      }
    }
},QUERY))


handler.delete(async (req,res)=>{
 
  if(req.result.type === "ERROR") return res.json(req.result)

  await connect()
      
  const {
      id
  } = req.query
    
  deleteOrderById(id)
  .then(result=>{  
    res.json(result)
  })
  .catch(err=>{ 
      res.json(err)
  })

})


handler.patch(async (req,res)=>{ 

  if(req.result.type === "ERROR") return res.json(req.result)
  
  await connect()
    
  const {
    delivered,
    paid,
    street,
    city,
    country,
    postCode,
    paymentMethod,
    comment
  } = req.body 
  const {
    id
  } = req.query
    
  updateOrder(id,{
    "isDelivered" : delivered, 
    "isPaid" : paid,
    "shippingAddress.street" : street ,
    "shippingAddress.city" : city,
    "shippingAddress.country" : country,
    "shippingAddress.postCode" : postCode, 
    "paymentMethod" : paymentMethod,
    "comment" : comment
 })
 .then(result=>{ 
     res.json(result)
 })
 .catch(err=>{ 
     res.json(err)
 })

})



 

export default handler