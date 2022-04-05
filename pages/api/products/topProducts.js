import {handler} from "../../../middlewares/errorMiddlewares"
import { connect  } from "../../../config/dbConn"
import {getTopProducts} from "../../../models/products/products" 

handler.get(async (req,res)=>{
   
    const {
        page ,
        pageSize
    } = req.query

    await connect()
     
    try{ 
       const result = await getTopProducts(parseInt(page || 0) , parseInt(pageSize || 100) )
       res.json({result})
    }catch(error){
        res.json({error})
    }
 
})

export default handler;