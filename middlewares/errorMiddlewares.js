import nc from "next-connect" 
 
export const handler = nc({
    onNoMatch : (req,res)=>{
        res.status(405).json({error : `${req.method} METHOD NOT ALOWED`})
    },
    onError : (err,req,res,next)=>{ 
        res.status(err.status || 500,err.message)
    }
})