import { connect  } from "../../../config/dbConn"
import {validate} from "../../../utilities/Validation"
import  {isAuth} from "../../../utilities/tokens_utilities";
import nc from "next-connect";
import {NoMatchEndpoint,errorHandler} from "../../../middlewares/errorMiddlewares"
import { addPrivilege, getAllPrivileges } from "../../../models/privileges/privileges";

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
   
    if(req.result.type === "ERROR") return res.status(403).json(req.result)
    
    try{
        await connect();
        const privileges = await getAllPrivileges();
         
        res.json(privileges)
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
     
        const privileges = await addPrivilege({
            name
        });
      
        res.json(privileges)
    }catch(errors){
        console.log(errors)
        res.status(400).json({errors})
    }

})


export default handler;