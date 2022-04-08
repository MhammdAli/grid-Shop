import {handler} from "../../../middlewares/errorMiddlewares"
import {clearTokens} from "../../../utilities/tokens_utilities"
handler.post(async (req,res)=>{
    
    clearTokens(res) 
    res.json({type : "SUCCESS"})
    
})

export default handler;