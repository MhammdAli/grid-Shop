 
import nc from "next-connect"
import { connect  } from "../../../config/dbConn"
import {addBrand, getAllBrands} from "../../../models/brand/brand" 
import  {isAuth} from "../../../utilities/tokens_utilities";
import {NoMatchEndpoint,errorHandler} from "../../../middlewares/errorMiddlewares"
import { hasPermission, PERMISSIONS } from "../../../middlewares/hasPermission";

const handler = nc({
    onNoMatch : NoMatchEndpoint,
    onError : errorHandler
})


handler.use(isAuth())
 
handler.get(hasPermission(PERMISSIONS.READ_BRAND),async (req,res)=>{
 
    
    await connect();  
      try{
         
          const barnds = await getAllBrands();
        
          res.json(barnds)
      }catch(err){
          res.status(400).json({name : err.name , message : err.message})
      }
   
})


handler.post(hasPermission(PERMISSIONS.WRITE_BRAND),async(req,res)=>{
 
    const {
       name
    } = req.body

    await connect(); 
    
    try{
         
        const barnd = await addBrand({
             brand : name
        });
      
        res.json(barnd)
    }catch(errors){
        
        res.status(400).json({errors})
    }

})



export default handler;