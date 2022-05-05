import {handler} from "../../../middlewares/errorMiddlewares"
import { connect  } from "../../../config/dbConn"
import {getAllProducts} from "../../../models/products/products" 
import {validate,isUndefined} from "../../../utilities/Validation"
 
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
        omit : [isUndefined]
    },
    subCategory : {
        path : "category.sub",
        omit : [isUndefined]
    },
    name : {
        path : "name",
        omit : [isUndefined]
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