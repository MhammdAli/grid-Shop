import {handler} from "../../../middlewares/errorMiddlewares"
import {verifyAccessToken} from "../../../utilities/tokens_utilities"
handler.post((req,res)=>{
 
    
   const {ACCESS_TOKEN , REFRESH_TOKEN} = req.cookies
   const isRefreshTokenExists = REFRESH_TOKEN ? true : false
    
   if(!ACCESS_TOKEN) return res.json({type : "ERROR" , name : "ACCESS_TOKEN_NOT_SPECIFIED" , isRefreshTokenExists})
 
   const AccessToken = verifyAccessToken(ACCESS_TOKEN)
   
   if(AccessToken.type === "ERROR") return res.json({type : "ERROR",name : AccessToken.name , isRefreshTokenExists})
   
   res.json({token : ACCESS_TOKEN, type : "SUCCESS"}) 

})

export default handler