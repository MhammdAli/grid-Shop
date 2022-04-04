import {handler} from "../../../middlewares/errorMiddlewares"
import { connect  } from "../../../config/dbConn"
import {getUserById} from "../../../models/users/users" 
// establish the connection with mongoDB
 
 
handler.get(async (req,res)=>{
   
    await connect()
      
    const {
        id
    } = req.query
      
    try{
      const user = await getUserById(id)
      res.json(user)
    }catch(err){
         res.json(err)
    }
  
})

export default handler;