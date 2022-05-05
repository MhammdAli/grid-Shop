import {connect,disconnect} from "../../../config/dbConn";
import {getOrderById}  from "../../../models/order/order";
import {handler} from "../../../middlewares/errorMiddlewares";
import  {isAuth} from "../../../utilities/tokens_utilities";
import axios from "axios";  
import { BODY, validate} from "../../../utilities/Validation";


handler.use(isAuth())
handler.use(validate({
    orderId : {
        required : [true,"order Id is required"]
    }
},BODY)) 

handler.post(async (req,res)=>{ 
 
    if(req.result.type === "ERROR") return res.json(req.result)
  
    const {
        orderId
    } = req.body

    await connect() 
    
    const UID = req.user.UID   

    try{
        const order = await getOrderById(orderId)  
        
        // only user whose order this order can pay
        if(order?.user?._id.toString() === UID){
            
            const itemsPrice = parseFloat(parseFloat(order?.itemsPrice || 0).toFixed(2))
            const shippingPrice = parseFloat(parseFloat(order?.shippingPrice || 0).toFixed(2))
            const taxPrice = parseFloat(parseFloat(order?.taxPrice || 0).toFixed(2))
            const discount = parseFloat(parseFloat(order?.discount || 0).toFixed(2))
        
            try{
            const {data} = await axios.post(`${process.env.PAYPAL_URL}/v2/checkout/orders`,{

                intent : "CAPTURE",
                purchase_units : [
                    {
                        amount : {
                            currency_code : "USD",
                            value : (itemsPrice + shippingPrice + taxPrice - discount).toFixed(2), 
                            breakdown : {
                                shipping : {
                                currency_code : "USD",
                                value : shippingPrice
                                },
                                item_total : {
                                currency_code : "USD",
                                value : itemsPrice
                                },
                                tax_total : {
                                    currency_code : "USD",
                                    value : taxPrice
                                },
                                discount : {
                                    currency_code : "USD",
                                    value : discount
                                }
                            }
                        },
                        shipping: {
                            name: {
                                full_name : "Mohamamd Harb"
                            },
                            address: {
                                address_line_1: order.shippingAddress?.street, 
                                admin_area_2: order.shippingAddress?.city,
                                admin_area_1: order.shippingAddress?.country,
                                postal_code: order.shippingAddress?.postCode,
                                country_code: "US"
                            }
                        }
                    }
                ],
                application_context : {
                    return_url : `http://localhost:3000/api/paypal/captureOrder?orderId=${orderId}`,
                    cancel_url : `http://localhost:3000/api/paypal/cancleOrder?orderId=${orderId}`,
                    brand_name : process.env.barndName,
                    shipping_preference : "SET_PROVIDED_ADDRESS",
                    user_action : "PAY_NOW", 
                }

            },{
                auth : {
                    username : process.env.PAYPAL_CLIENT_ID,
                    password : process.env.PAYPAL_SECRET_KEY
                }
            })

            res.json({approval : data.links[1].href})
    
        }catch(err){  
            res.status(400).json({type : "ERROR" , name : err.response.name , message : err.response.message})
        }
        
        }else{
            return res.status(403).json({name : "FORBIDDEN" , message : "you don't have a permession in this resource"})
        }
        

    }catch(err){ 
        res.json({type : "ERROR" , name : err.name})
    }
    
    

    await disconnect()
    
});

export default handler