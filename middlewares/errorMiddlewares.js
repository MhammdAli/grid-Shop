import multer from "multer"
import { isUploaderError } from "../lib/Uploader/uploaderErrors"

export function NoMatchEndpoint(req,res){
    res.status(405).json({error : `${req.method} METHOD NOT ALOWED`})
}

export function errorHandler(err,req,res){ 
    console.log( isUploaderError(err))
    if(err instanceof multer.MulterError || isUploaderError(err)){   
        res.status(400).json({
            name : err?.name,
            message : err?.message
        }) 
    }else{ 
        res.status(err?.status || 500)
        .json({
            message : err?.message
        }) 
    }
}