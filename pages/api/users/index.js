import { connect  } from "../../../config/dbConn"
import {getUsers} from "../../../models/users/users"  
import  {isAuth} from "../../../utilities/tokens_utilities"
import { validate } from "../../../utilities/Validation";

import nc from "next-connect";
import {NoMatchEndpoint,errorHandler} from "../../../middlewares/errorMiddlewares"
import { handleDateOperator , handleTextOperator} from "../../../utilities/mongoOperators";

const handler = nc({
    onNoMatch : NoMatchEndpoint,
    onError : errorHandler
})
 
 


handler.use(isAuth())


handler.use(validate({
    page : { 
        required : [true,"page is required"],
        match : {
            validator : (page)=>parseInt(page) >= 0,
            message : "page must be greater or equal than 0"
        }
    },
    pageSize : {  
        default : 20,
        match : {
            validator : (pageSize)=>pageSize >0 && pageSize <=100,
            message : "page Size must be between 1 and 100"
        }
    },
    id : {
        match : {
            validator : function(){return this.isAdmin},
            message : "no permission"
        }
    },
    firstName : {
        path : "firstName", 
        calculated : (field , operator , value)=>{
            return handleTextOperator("firstName",operator,value)
        }
    },
    lastName : {
        path : "lastName",
        calculated : (field , operator , value)=>{
            return handleTextOperator("lastName",operator,value)
        }
    },
    email : {
        path : "email",
        calculated : (field , operator , value)=>{
            return handleTextOperator("email",operator,value)
        }
    },
    createdAt : {
        path : "createdAt",
        calculated : (field , operator , value)=>{
            return handleDateOperator("createdAt",operator,value)
        }
    },
    updatedAt : {
        path : "createdAt",
        calculated : (field , operator , value)=>{
            return handleDateOperator("updatedAt",operator,value)
        }
    },
}))

handler.get(async (req,res)=>{
    
  if(req.result.type === "ERROR") return res.json(req.result)
 
  await connect()
 
  const {
     page,
     pageSize
  } = req.query 

  try{
    const user = await getUsers(req.result.search,page , pageSize)
    
    res.json(user)
  }catch(err){
        res.json(err)
  }
  
})

export default handler;