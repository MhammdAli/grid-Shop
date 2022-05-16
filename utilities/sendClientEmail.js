import axios from "axios";
export class sendEmail{
   
    setCC(Cc){
      this.cc = Cc;
      return this;
    }
    setBCC(Bcc){
      this.bcc = Bcc;
      return this;
    }
  
    setSubject(subject){
      this.subject = subject;
      return this;
    }
  
    setBody(body){
      this.body = body;
      return this;
    }
  
    setTo(to){
      this.to = to
      return this;
    }

    setFrom(from){
        this.from = from;
        return this;
    }
  
    async send(){ 
        try{
          return await axios.post("/api/send/email",this)
        }catch(err){  
           return Promise.reject(err.response.data);
        }
    }

  }