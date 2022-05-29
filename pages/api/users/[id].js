import { connect  } from "../../../config/dbConn"
import {deleteUser, getUserById, updateById} from "../../../models/users/users"  
import  {isAuth,clearTokens} from "../../../utilities/tokens_utilities" 
import multer from "multer";
import fs from "fs";

import nc from "next-connect";
import {NoMatchEndpoint,errorHandler} from "../../../middlewares/errorMiddlewares"
import { hasPermission , PERMISSIONS} from "../../../middlewares/hasPermission";

const handler = nc({
    onNoMatch : NoMatchEndpoint,
    onError : errorHandler
})


handler.use(isAuth())

const IF_FAIL_READ_OWN_DATA = {onError : function(req,res,next){
  const user = req.user;
  const {id} = req.query; 
  if(user?.UID === id || id === "me") return next();
  res.status(403).json({name : "UNAUTHORIZED",message : "no Permission"})
}}

handler.get(hasPermission(PERMISSIONS.READ_USER,IF_FAIL_READ_OWN_DATA),async (req,res)=>{
     
 
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
 

handler.delete(hasPermission(PERMISSIONS.DELETE_USER,IF_FAIL_READ_OWN_DATA),async (req,res)=>{

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
handler.patch(hasPermission(PERMISSIONS.WRITE_USER,IF_FAIL_READ_OWN_DATA),async (req,res)=>{ 
 
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