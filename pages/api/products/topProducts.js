import { connect  } from "../../../config/dbConn"
import {getTopProducts} from "../../../models/products/products" 

import nc from "next-connect";
import {NoMatchEndpoint,errorHandler} from "../../../middlewares/errorMiddlewares"
import { validate } from "../../../utilities/Validation";

const handler = nc({
    onNoMatch : NoMatchEndpoint,
    onError : errorHandler
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
    }
}));

handler.get(async (req,res)=>{

    if(req.result.type === "ERROR") return res.status(400).json(req.result.error)

    const {
        page ,
        pageSize
    } = req.query

    await connect()
     
    try{ 
       const result = await getTopProducts(parseInt(page || 0) , parseInt(pageSize || 100) )
        
       res.json({result})
    }catch(error){
        console.log(error)
        res.json({error})
    }
 
})

export default handler;