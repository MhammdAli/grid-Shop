import { connect  } from "../../../config/dbConn"
import {addCategory, getAllCategories} from "../../../models/category/category" 
import {validate} from "../../../utilities/Validation"
import  {isAuth} from "../../../utilities/tokens_utilities";
import nc from "next-connect";
import {NoMatchEndpoint,errorHandler} from "../../../middlewares/errorMiddlewares"

const handler = nc({
    onNoMatch : NoMatchEndpoint,
    onError : errorHandler
})

handler.use(isAuth())

handler.use(validate({
    permission : {
        match : {
            validator : function(){return this.isAdmin},
            message : "no permission"
        }
    }
}))

handler.get(async (req,res)=>{
   
    if(req.result.type === "ERROR") return res.json(req.result)
    
    try{
        await connect();
        const categories = await getAllCategories();
         
        res.json(categories)
    }catch(err){
        res.status(400).json({name : err.name , message : err.message})
    }

})



handler.post(async(req,res)=>{

    if(req.result.type === "ERROR") return res.json(req.result)

    const {
       mainCategory,
       subCategory
    } = req.body

    await connect(); 
    
    try{
     
        const barnds = await addCategory({
            mainCategory : mainCategory,
            subCategory : subCategory
        });
      
        res.json(barnds)
    }catch(errors){
        res.status(400).json({errors})
    }

})


export default handler;