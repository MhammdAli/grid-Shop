import {handler} from "../../../middlewares/errorMiddlewares"
import { connect  } from "../../../config/dbConn"
import {setTokens , buildTokens} from "../../../utilities/tokens_utilities"
import {getUserByEmail} from "../../../models/users/users"
import {comparePassword} from "../../../config/security"

handler.post(async (req,res)=>{
 
    await connect()

    const {
        email,
        password
    } = req.body;

    try{
        const user = await getUserByEmail(email)
         
        if(!user) return res.json({type : "ERROR" , name : "EMAIL_NOT_FOUND"})
         
        if((await comparePassword(password , user.password))){
            const userPayload = { 
                UID : user._id.toString(),
                userName : user.firstName + " " + user.lastName
            } 

            const {accessToken, refreshToken} = buildTokens(userPayload)
             
            setTokens(res,accessToken,refreshToken)

            res.json({type : "SUCCESS" , token : accessToken})

        }else{
            return res.json({type : "ERROR" , name : "INVALID_PASSWORD"})  // incorrect pass
        }
      }catch(err){ 
          console.log(err)
          res.json({type : "ERROR",name : err.name})
      }
       
 
})

export default handler;