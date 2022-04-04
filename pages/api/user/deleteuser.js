import {handler} from "../../../middlewares/errorMiddlewares"
import { connect  } from "../../../config/dbConn"
import {deleteUser} from "../../../models/users/users" 

handler.delete(async (req,res)=>{
   
    await connect()
     
    // for testing but you have to get it from token
    const {
        id
    } = req.body
      
   deleteUser(id)
   .then(result=>{ 
       res.json(result)
   })
   .catch(err=>{ 
       res.json(err)
   })

})

export default handler;