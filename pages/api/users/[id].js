import { connect  } from "../../../config/dbConn"
import {deleteUser, getUserById, updateById} from "../../../models/users/users"  
import  {isAuth,clearTokens} from "../../../utilities/tokens_utilities"
import {  QUERY, validate} from "../../../utilities/Validation";
import multer from "multer";
import fs from "fs";

import nc from "next-connect";
import {NoMatchEndpoint,errorHandler} from "../../../middlewares/errorMiddlewares"

const handler = nc({
    onNoMatch : NoMatchEndpoint,
    onError : errorHandler
})


handler.use(isAuth())

handler.use(validate({
  id : {
    match : {
      validator : function(id){
          // this is refer to user credintials (decoded token) it is depend on isAuth function
          return this.UID === id || this.isAdmin || id === "me"
      },
      message : "no permission to call this api"
    }
  }
},QUERY))
 
handler.get(async (req,res)=>{
     
  if(req.result.type === "ERROR") return res.status(403).json(req.result)

  await connect()
    
  const {
      id
  } = req.query
   
  try{
    const user = await getUserById(id === "me" ? req.user.UID : id)
    res.json(user)
  }catch(err){
    res.json(err)
  }
  
})
 

handler.delete(async (req,res)=>{

  if(req.result.type === "ERROR") return res.status(403).json(req.result)

  await connect()
      
  const {
      id
  } = req.query
    
  deleteUser(id === "me" ? req.user.UID : id)
  .then(result=>{ 
    clearTokens(res)
    res.json(result)
  })
  .catch(err=>{ 
      res.json(err)
  })

})


export const config = {
  api: {
    bodyParser: false,
  },
};

 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {  
    cb(null,"public/images")
  },
  filename: async function (req, file, cb) { 
    const extension = file.originalname.substring(file.originalname.lastIndexOf("."))
    const fileName = Date.now() + extension
    cb(null, fileName)  
    
  }
})
 
const uploader = multer({
  storage,
  fileFilter : (req, file, cb)=>{  
      if(file.originalname.match(/\.(png|jpg|jpeg)$/i)){
        cb(null , true)
      }else{
        cb("this file not accepted",false)
      }
  },
  limits : {
    fileSize : 10 * 1000 * 1000
  }
})

handler.use(uploader.single("avatar"))
handler.patch(async (req,res)=>{ 
 
  if(req.result.type === "ERROR") return res.json(req.result)
    
  await connect()
    
  const {
    firstName,
    lastName
  } = req.body 
  const {
    id
  } = req.query
     
 updateById(id === "me" ? req.user.UID : id,{
     firstName : firstName,
     lastName : lastName, 
     imageUrl : req.file && req.file?.filename 
 })
 .then(result=>{ 
 
    res.json({
        result : {
          firstName,
          lastName,
          imageUrl : req.file && req.file?.filename  
        },
        isChanged : true
    })

    const oldImageLocation = `public/images/${result.imageUrl}`
    if(fs.existsSync(oldImageLocation)){
        fs.unlink(oldImageLocation,()=>{})
    }
 })
 .catch(err=>{ 
     res.json(err)
 })

})


export default handler;