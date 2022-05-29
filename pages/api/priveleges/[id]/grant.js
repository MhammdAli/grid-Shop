import { connect  } from "../../../../config/dbConn";
import {grantUserPrivilages} from "../../../../models/privileges/privileges";  
import  {isAuth} from "../../../../utilities/tokens_utilities";
 
import nc from "next-connect";
import {NoMatchEndpoint,errorHandler} from "../../../../middlewares/errorMiddlewares"
import { CheckPermission, hasPermission, PERMISSIONS } from "../../../../middlewares/hasPermission";
 
const handler = nc({
    onNoMatch : NoMatchEndpoint,
    onError : errorHandler
})


handler.use(isAuth())
 
handler.patch(hasPermission(PERMISSIONS.GRANT_ROLES,{onSucess : (req,res,next)=>{
  const user = req.user;
  const {id} = req.query; 
  console.log(user,id)
  if(user?.UID !== id || CheckPermission(user?.roles === PERMISSIONS.GRANT_OWN_ROLES)) return next();
  res.status(403).json({name : "UNAUTHORIZED",message : "no Permission"})
}}),async (req,res)=>{
      
 
  await connect()
    
  const {
      id
  } = req.query

  const {
      roles
  } = req.body

  try{
    const user = await grantUserPrivilages(id,roles)
    res.json(user)
  }catch(err){
      console.log(err)
    res.json(err)
  }
  
})

export default handler;