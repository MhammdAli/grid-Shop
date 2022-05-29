import { connect  } from "../../../config/dbConn"
import {addCategory, getAllCategories} from "../../../models/category/category" 
import  {isAuth} from "../../../utilities/tokens_utilities";
import nc from "next-connect";
import {NoMatchEndpoint,errorHandler} from "../../../middlewares/errorMiddlewares"
import { hasPermission, PERMISSIONS } from "../../../middlewares/hasPermission";

const handler = nc({
    onNoMatch : NoMatchEndpoint,
    onError : errorHandler
})

handler.use(isAuth())

 
handler.get(hasPermission(PERMISSIONS.READ_CATEGORY),async (req,res)=>{
   
 
    try{
        await connect();
        const categories = await getAllCategories();
         
        res.json(categories)
    }catch(err){
        res.status(400).json({name : err.name , message : err.message})
    }

})



handler.post(hasPermission(PERMISSIONS.WRITE_CATEGORY),async(req,res)=>{

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