import {validate} from "../../../utilities/Validation"
import  {isAuth} from "../../../utilities/tokens_utilities";
import nc from "next-connect";
import {NoMatchEndpoint,errorHandler} from "../../../middlewares/errorMiddlewares"
import { SendEmail } from "../../../utilities/nodeMailer";
import { hasPermission, PERMISSIONS } from "../../../middlewares/hasPermission";

const handler = nc({
    onNoMatch : NoMatchEndpoint,
    onError : errorHandler
})

handler.use(isAuth())

handler.use(validate({ 
    to : {
        match : {
            validator : (value)=>{
                return !/^([\w]*[\w.]*(?!\.)@gmail.com)/.test(value)
            },
            message : "to field is required"
        }
    } 
}))

handler.post(hasPermission(PERMISSIONS.SEND_EMAIL_USER),async (req,res)=>{
   

   
    if(req.result.type === "ERROR") return res.status(400).json(req.result)
    
    const {
        to,
        from,
        body,
        cc,
        bcc,
        subject
    } = req.body;

    try{
         
        const result = await new SendEmail()
        .to(to)
        .From(from === "ME" || typeof from === "undefined" ? process.env.EMAIL_SENDER : from)
        .setText(body)
        .setCc(cc)
        .setBcc(bcc)
        .setSubject(subject)
        .send();
         
        res.json(result)
    }catch(err){  
        res.status(400).json(err.response.data)
    }

})

 

export default handler;
