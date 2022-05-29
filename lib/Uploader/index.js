import multer from "multer"; 
import fs from "fs";
import path from "path";
import { UPLODAER_ERRORS } from "./uploaderErrors";
function diskStorage(diskPath){ 
  
    return multer.diskStorage({
        destination: function (req, file, cb) {
          console.log("exists file####")
            if(fs.existsSync(path.resolve(diskPath))) return cb(null,diskPath)

            console.log("HEKEKEKEKKE####")
            fs.mkdir(path.resolve(diskPath),{recursive : true},(err)=>{
                if(err){
                   return cb(err.message,null)
                }
  
                cb(null,diskPath)
            })
        },
        filename: async function (req, file, cb) { 
          console.log("file NAME ###")
          const extension = file.originalname.substring(file.originalname.lastIndexOf("."))
          const fileName = Date.now() + extension
          cb(null, fileName)  
          
        }
    })
}
   

export function uploader(DiskPath , options){
  
  return multer({
    storage : diskStorage(DiskPath),
    fileFilter : (req, file, cb)=>{  
      
        if(file.originalname.match(/\.(png|jpg|jpeg)$/i)){
         
          cb(null , true)
        }else{
          cb({
            name : UPLODAER_ERRORS.FILE_NOT_ACCEPTED,
            message : `the only valid extensions are (png|jpg|jpeg) , got (${file.originalname.substring(file.originalname.lastIndexOf("."))}))`
          },false)
        }
    },
    limits : {
      fileSize : options?.fileSize || 100 * 1000 * 1000 * 1000
    }
  })
}

export const DELETE_ERRORS = {
    FILE_NOT_EXISTS : "FILE_NOT_EXISTS",
    FILE_NOT_DELETED : "FILE_NOT_DELETED"
}
export function deleteUploadFile(path){
    return new Promise((resolve , reject)=>{

      const oldImageLocation = path
      if(fs.existsSync(oldImageLocation)){
          fs.unlink(oldImageLocation,(err)=>{
            if(err) return reject(DELETE_ERRORS.FILE_NOT_DELETED) 
            return resolve()
          })
      }

      reject(DELETE_ERRORS.FILE_NOT_EXISTS)

    })
    
}