// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {connect} from "../../../config/dbConn"
import {updateOrder}  from "../../../models/order/order"
import  {isAuth} from "../../../utilities/tokens_utilities"
import axios from "axios"
import nc from "next-connect";
import {NoMatchEndpoint,errorHandler} from "../../../middlewares/errorMiddlewares"

const handler = nc({
    onNoMatch : NoMatchEndpoint,
    onError : errorHandler
})

handler.use(isAuth())

handler.get(async (req,res)=>{ 
    
   const {
        orderId,
        token
   } = req.query

    await connect()
    try{
       
        const {data} = await axios.post(`${process.env.PAYPAL_URL}/v2/checkout/orders/${token}/capture`,{},{
            auth : {
                username : process.env.PAYPAL_CLIENT_ID,
                password : process.env.PAYPAL_SECRET_KEY
            }
        }) 
 
        // money is transfered successfuly
        if(data.status === "COMPLETED"){
           
            updateOrder(orderId,{
                isPaid : true,
                paidAt : new Date()
            })
            .then((()=>{ 
              res.redirect(`http://localhost:3000/order/${orderId}`)
            }))
            .catch(err=>{  
              res.json({err})
            }) 
        }
        
    
    }catch(err){  
        res.json(err.response.data)
    }

   
    
});

export default handler