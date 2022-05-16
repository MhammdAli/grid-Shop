 
import nc from "next-connect"
import { connect  } from "../../../config/dbConn"
import {addBrand, getAllBrands} from "../../../models/brand/brand" 
import {validate} from "../../../utilities/Validation"
import  {isAuth} from "../../../utilities/tokens_utilities";
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
   
    await connect(); 
    
      try{
         
          const barnds = await getAllBrands();
        
          res.json(barnds)
      }catch(err){
          res.status(400).json({name : err.name , message : err.message})
      }
   
})


handler.post(async(req,res)=>{

    if(req.result.type === "ERROR") return res.json(req.result)

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