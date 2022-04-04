import {handler} from "../../../middlewares/errorMiddlewares"
import { connect  } from "../../../config/dbConn"
import {createUser} from "../../../models/users/users" 
// establish the connection with mongoDB
 


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
        res.json({user , type : "SUCCESS" })
    }).catch(err=>{
        res.json({err , type : "ERROR"})
    })



})

export default handler;