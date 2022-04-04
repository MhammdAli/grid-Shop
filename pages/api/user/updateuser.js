import {handler} from "../../../middlewares/errorMiddlewares"
import { connect  } from "../../../config/dbConn"
import {updateById} from "../../../models/users/users" 
 
handler.post(async (req,res)=>{
   
    await connect()
     
    // for testing but you have to get it from token
    const {
        id,
        firstName,
        lastName,
        email,
        imageUrl
    } = req.body
      
   updateById(id,{
       firstName : firstName,
       lastName : lastName,
       email : email,
       imageUrl : imageUrl
   })
   .then(result=>{ 
       res.json(result)
   })
   .catch(err=>{
       console.log(err)
       res.json(err)
   })

})

export default handler;