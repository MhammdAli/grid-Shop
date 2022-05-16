import  {isAuth} from "../../../utilities/tokens_utilities"
import nc from "next-connect";
import {NoMatchEndpoint,errorHandler} from "../../../middlewares/errorMiddlewares"

const handler = nc({
    onNoMatch : NoMatchEndpoint,
    onError : errorHandler
})


handler.use(isAuth())

handler.get(async (req,res)=>{ 
     
    const {
        orderId
    } = req.query

    res.redirect(`http://localhost:3000/order/${orderId}`)

});

export default handler