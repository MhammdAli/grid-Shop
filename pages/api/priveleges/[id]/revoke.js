import { connect  } from "../../../../config/dbConn";
import {RevokeUserPrivilages} from "../../../../models/privileges/privileges";  
import  {isAuth} from "../../../../utilities/tokens_utilities";
 
import nc from "next-connect";
import {NoMatchEndpoint,errorHandler} from "../../../../middlewares/errorMiddlewares"
import { hasPermission, PERMISSIONS } from "../../../../middlewares/hasPermission";
 
const handler = nc({
    onNoMatch : NoMatchEndpoint,
    onError : errorHandler
})


handler.use(isAuth())

  
handler.patch(hasPermission(PERMISSIONS.REVOKE_ROLES),async (req,res)=>{
       
  await connect()
    
  const {
      id
  } = req.query

  const {
      roles
  } = req.body

  try{
    const user = await RevokeUserPrivilages(id,roles)
    res.json(user)
  }catch(err){
      console.log(err)
    res.json(err)
  }
  
})

export default handler;