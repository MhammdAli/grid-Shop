import {clearTokens} from "../../../utilities/tokens_utilities"

import nc from "next-connect";
import {NoMatchEndpoint,errorHandler} from "../../../middlewares/errorMiddlewares"

const handler = nc({
    onNoMatch : NoMatchEndpoint,
    onError : errorHandler
})


handler.post(async (req,res)=>{
    
    clearTokens(res) 
    res.json({type : "SUCCESS"})
    
})

export default handler;