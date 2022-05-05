import multer from "multer"
import nc from "next-connect" 
 
export const handler = nc({
    onNoMatch : (req,res)=>{
        res.status(405).json({error : `${req.method} METHOD NOT ALOWED`})
    },
    onError : (err,req,res)=>{ 
        if(err instanceof multer.MulterError){ 
            res.status(400).json({
                code : err.code, 
                message : err.message
            }) 
        }else
           res.status(err.status || 500,err.message)
    }
})