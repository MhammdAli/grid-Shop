import mongoose from "mongoose"

export async function connect() { 
  
    try{
        return await mongoose.connect(process.env.MONGODB_URL,{user : process.env.MONGODB_USER , pass : process.env.MONGODB_PASS})
    }catch(err){
        if(process.env.NODE_ENV === "development") console.log(err.name)
        //process.exit(1)
    }
        
    

}

export async function isConnected(){
    return mongoose.connections[0].readyState === mongoose.STATES.connected
}

export async function disconnect(){
    try{
       return await mongoose.disconnect()
    }catch(err){
        return false
    }
}

