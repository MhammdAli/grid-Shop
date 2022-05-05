import axios  from "axios";
export async function createOrder(orderId){
     
    try{
      const {data} = await axios.post("/api/paypal/createOrder",{orderId}) 
      
      return Promise.resolve(data.approval)
    }catch(err){
      return Promise.reject(err.name)
    }
    
}