import {handler} from "../../../middlewares/errorMiddlewares"
import { connect  } from "../../../config/dbConn"
import {getProductBySlugName} from "../../../models/products/products" 

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