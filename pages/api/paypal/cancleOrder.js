import {handler} from "../../../middlewares/errorMiddlewares"
import  {isAuth} from "../../../utilities/tokens_utilities"

handler.use(isAuth())

handler.get(async (req,res)=>{ 
     
    const {
        orderId
    } = req.query

    res.redirect(`http://localhost:3000/order/${orderId}`)

});

export default handler