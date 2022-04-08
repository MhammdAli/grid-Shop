import {verifyAccessToken , verifyRefreshToken,refreshTokens,setTokens} from "../utilities/tokens_utilities"
import { getUserById } from "../models/users/users"
import { connect } from "../config/dbConn"; 
/*
* The purpose of this function is to check if the session is active if not it will refresh the refresh token 
* @return 
* 1) object contains the type which is used to distinguish between the errors and the success messages
* @params
*  1) req is used to get the tokens from cookies 
*  2) res is used to set Tokens in the headers of the http to send it to the client
*/
export async function getSession({req,res}){

    await connect()

    const {ACCESS_TOKEN,REFRESH_TOKEN} = req.cookies

    const AccessToken = await verifyAccessToken(ACCESS_TOKEN)
    
    // if there is an error in access token try to refresh it
    if(AccessToken.type === "ERROR"){ 
    
        if(!REFRESH_TOKEN) return {type : "ERROR",name : "REFRESH_TOKEN_NOT_SPECIFIED"}

        const getRefreshToken = await verifyRefreshToken(REFRESH_TOKEN)
         
        if(getRefreshToken.type === "ERROR") return {type : "ERROR",name : "REFRESH_TOKEN_INVALID"}

        const {UID} = getRefreshToken

        var user ;
        try{
            user= await getUserById(UID)
        }catch(err){
            console.log(err)
        }
        // if user is nit exists maybe he is delete his user but token is valid
        if(!user) return {type : "ERROR",name : "USER_NOT_EXISTS"}
        
        const {accessToken,refreshToken} = refreshTokens(getRefreshToken)
 
    
        setTokens(res,accessToken,refreshToken)
   
        return {type : "SUCCESS", token : accessToken}  
    }
    else 
      return {type : "SUCCESS",token : ACCESS_TOKEN}
  
  }
