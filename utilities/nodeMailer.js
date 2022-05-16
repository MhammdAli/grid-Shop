import nodemailer from "nodemailer";
const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;
 
const transporter = nodemailer.createTransport({
    service : "gmail",
    host : "smtp.gmail.com",
    port : 587,
    auth : {
        type: "OAuth2",
        user: process.env.EMAIL_SENDER, 
        clientId : process.env.GMAIL_CLIENT_ID,
        clientSecret : process.env.GMAIL_CLIENT_SECRET,
        refreshToken : REFRESH_TOKEN, 
    }
})

 
export class SendEmail{
   #mailOptions = {}
   From(from){
      this.#mailOptions.from = from;
      return this
   }

   to(to){  
      if(typeof to === "string") to = [to];
      this.#mailOptions.to = to.join(","); 
      return this;
   }

   setSubject(subject){
       this.#mailOptions.subject = subject;
       return this;
   }

   setText(text){
       this.#mailOptions.text = text;
       return this;
   }

   setHtml(html){
       this.#mailOptions.html = html;
       return this;
   }

   setCc(cc){
        this.#mailOptions.cc = cc;
        return this;
   }

   setBcc(Bcc){
        this.#mailOptions.cc = Bcc;
        return this;
   }

   async send(){    
    try{   
        const result = await transporter.sendMail(this.#mailOptions);
        return result;
    }catch(err){ 
        return err;
    }
   }
} 


