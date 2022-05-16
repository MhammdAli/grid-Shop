import { connect  } from "../../../config/dbConn"
import {setTokens , refreshTokens , verifyRefreshToken,clearTokens} from "../../../utilities/tokens_utilities"
import {getUserById} from "../../../models/users/users"
import {createError} from "../../../utilities/Errors/CustomErrors"

import nc from "next-connect";
import {NoMatchEndpoint,errorHandler} from "../../../middlewares/errorMiddlewares"

const handler = nc({
    onNoMatch : NoMatchEndpoint,
    onError : errorHandler
})


handler.post(async (req,res)=>{
 
    try{
    await connect()
    }catch(err){
        res.json(createError("SOMTHING_WRONG"))
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
        res.json(createError(error.name))
      }
     
    
    
})

export default handler;