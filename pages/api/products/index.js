import { connect  } from "../../../config/dbConn"
import {getAllProducts} from "../../../models/products/products" 
import {validate} from "../../../utilities/Validation"
import { handleTextOperator} from "../../../utilities/mongoOperators";
import nc from "next-connect";
import {NoMatchEndpoint,errorHandler} from "../../../middlewares/errorMiddlewares"

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
    },
    mainCategory : {
        path : "category.main",
        calculated : (field , operator , value)=>{
            return handleTextOperator("category.main",operator,value)
        }
    },
    subCategory : {
        path : "category.sub", 
        calculated : (field , operator , value)=>{
            return handleTextOperator("category.sub",operator,value)
        }
    },
    name : {
        path : "name",
        calculated : (field , operator , value)=>{
            return handleTextOperator("name",operator,value)
        }
    }
}))

handler.get(async (req,res)=>{ 

    if(req.result.type === "ERROR") return res.status(400).json(req.result.error)

    const {
        page ,
        pageSize
    } = req.query 

    await connect()
     
    try{ 
       const result = await getAllProducts(
          req.result.search
       ,page , pageSize)
       res.json({result})
    }catch(error){
        res.json({error})
    }
 
})



export default handler;