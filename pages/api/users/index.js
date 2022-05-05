import {handler} from "../../../middlewares/errorMiddlewares"
import { connect  } from "../../../config/dbConn"
import {getUsers} from "../../../models/users/users"  
import  {isAuth} from "../../../utilities/tokens_utilities"
import { validate , isUndefined} from "../../../utilities/Validation";
 
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
    fname : {
        path : "firstName",
        omit : [isUndefined]
    },
    lname : {
        path : "lastName",
        omit : [isUndefined]
    },
    email : {
        path : "email",
        omit : [isUndefined]
    },
    createdAt : {
        path : "createdAt",
        omit : [isUndefined]
    },
    updatedAt : {
        path : "updatedAt",
        omit : [isUndefined]
    }
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