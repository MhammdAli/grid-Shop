import { connect  } from "../../../../config/dbConn";
import {updateUserPrivilages} from "../../../../models/users/users";  
import  {isAuth} from "../../../../utilities/tokens_utilities";
import {  QUERY, validate} from "../../../../utilities/Validation";
 
import nc from "next-connect";
import {NoMatchEndpoint,errorHandler} from "../../../../middlewares/errorMiddlewares"
 
const handler = nc({
    onNoMatch : NoMatchEndpoint,
    onError : errorHandler
})


handler.use(isAuth())

handler.use(validate({
  permission : {
    match : {
      validator : function(){ 
          return this.isAdmin  
      },
      message : "no permission to call this api"
    }
  }
},QUERY))
 
handler.patch(async (req,res)=>{
     
    console.log(req.result)
  if(req.result.type === "ERROR") return res.status(403).json(req.result)

  await connect()
    
  const {
      id
  } = req.query

  const {
      roles
  } = req.body

  try{
    const user = await updateUserPrivilages(id,roles)
    res.json(user)
  }catch(err){
      console.log(err)
    res.json(err)
  }
  
})

export default handler;