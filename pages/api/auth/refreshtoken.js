import {handler} from "../../../middlewares/errorMiddlewares"
import { connect  } from "../../../config/dbConn"
import {setTokens , refreshTokens , verifyRefreshToken,clearTokens} from "../../../utilities/tokens_utilities"
import {getUserById} from "../../../models/users/users"

handler.post(async (req,res)=>{
 
    try{
    await connect()
    }catch(err){
        res.json({type : "ERROR",name : "SOMTHING_WRONG"})
    }

    try {
        
        const current = verifyRefreshToken(req.cookies["REFRESH_TOKEN"])

        const user = await getUserById(current.UID)

        if (!user){
            const error = new Error("User Not Found")
            error.name = "USER_NOT_FOUND"
            throw error
        }
    
    
        const {accessToken, refreshToken} = refreshTokens(current, user.tokenVersion)
        setTokens(res, accessToken, refreshToken)
        res.json({type : "SUCCESS",token : accessToken })

      } catch (error) { 
        clearTokens(res)
        res.json({type : "ERROR",name : error.name})
      }
     
    
    
})

export default handler;