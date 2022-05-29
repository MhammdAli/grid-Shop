 
import nc from "next-connect"
import { connect  } from "../../../config/dbConn"
import {addBranch, getAllBranches} from "../../../models/branches/branch" 
import  {isAuth} from "../../../utilities/tokens_utilities"; 
import {NoMatchEndpoint,errorHandler} from "../../../middlewares/errorMiddlewares"
import { hasPermission, PERMISSIONS } from "../../../middlewares/hasPermission";

const handler = nc({
    onNoMatch : NoMatchEndpoint,
    onError : errorHandler
})

handler.use(isAuth())


handler.get(hasPermission(PERMISSIONS.READ_BRANCH),async (req,res)=>{
   
    await connect(); 
    
      try{
         
          const barnds = await getAllBranches();
        
          res.json(barnds)
      }catch(err){
          res.status(400).json({name : err.name , message : err.message})
      }
   
})

 
handler.post(hasPermission(PERMISSIONS.WRITE_BRANCH),async(req,res)=>{

    const {
       name,
       address
    } = req.body

    await connect(); 
    
    try{
         
        const barnds = await addBranch({
             branchName : name,
             branchAddress : address
        });
      
        res.json(barnds)
    }catch(errors){
        console.log(errors)
        res.status(400).json({errors})
    }

})


export default handler;