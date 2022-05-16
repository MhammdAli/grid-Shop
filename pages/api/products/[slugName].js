import { connect  } from "../../../config/dbConn"
import {getProductBySlugName} from "../../../models/products/products" 
import nc from "next-connect";
import {NoMatchEndpoint,errorHandler} from "../../../middlewares/errorMiddlewares"

const handler = nc({
    onNoMatch : NoMatchEndpoint,
    onError : errorHandler
})

handler.get(async (req,res)=>{
   
    const {
        slugName
    } = req.query

   
    await connect()
     
    try{ 
       const result = await getProductBySlugName(slugName)
       res.json({result})
    }catch(error){
        res.json({error})
    }
 
})

export default handler;