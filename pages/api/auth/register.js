import { connect  } from "../../../config/dbConn"
import {createUser} from "../../../models/users/users" 
import {buildTokens , setTokens} from "../../../utilities/tokens_utilities"

import nc from "next-connect";
import {NoMatchEndpoint,errorHandler} from "../../../middlewares/errorMiddlewares"

const handler = nc({
    onNoMatch : NoMatchEndpoint,
    onError : errorHandler
})


handler.post(async (req,res)=>{
   
    await connect()
     
    const {
        firstName,
        lastName,
        email,
        password,
    } = req.body
      
    createUser({
        firstName : firstName,
        lastName : lastName,
        email : email,
        password : password
    }).then(user=>{ 

        const userPayload = { 
            UID : user._id.toString(),
            userName : user.firstName + " " + user.lastName,
            isAdmin : user.isAdmin ? true : false,
            roles : user.roles
        }

        const {accessToken, refreshToken} = buildTokens(userPayload) 
        setTokens(res,accessToken,refreshToken) 
        res.json({type : "SUCCESS" , token : accessToken}) 

    }).catch(err=>{
        res.json({err , type : "ERROR"})
    })



})

export default handler;