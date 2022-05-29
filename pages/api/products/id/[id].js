import { connect  } from "../../../../config/dbConn"
import {updateProductById} from "../../../../models/products/products"  
import nc from "next-connect";
import {NoMatchEndpoint,errorHandler} from "../../../../middlewares/errorMiddlewares"
import {uploader,deleteUploadFile} from "../../../../lib/Uploader";
import { hasPermission, PERMISSIONS } from "../../../../middlewares/hasPermission";
import  {isAuth} from "../../../../utilities/tokens_utilities"
const handler = nc({
    onNoMatch : NoMatchEndpoint,
    onError : errorHandler
})

handler.use(isAuth())

export const config = {
    api: {
      bodyParser: false,
    },
};

const upload = uploader("public/imgs/products",{fileSize : 200 * 1000 * 1000 * 1000})

 

handler.patch(hasPermission(PERMISSIONS.EDIT_PRODUCTS),upload.single("avatar"),async(req,res)=>{

    const {id} = req.query;

    const {
        name,
        slugName,
        mainCategory,
        subCategory,
        price,
        brand,
        stockNames, 
        description,
        ItemDetails,
        discount
    } = req.body;

    await connect() 
  

    try{
        const product = await  updateProductById(id,{
            name,
            slugName,
            "category.main" : mainCategory,
            "category.sub"  : subCategory,
            image : req.file && req.file?.filename,
            price,
            stocks : stockNames && JSON.parse(stockNames),
            discount,
            brand, 
            description,
            ItemDetails : ItemDetails && JSON.parse(ItemDetails)
        })
      
        res.status(200).json({ product , type : "success"})
      }catch(error){
          try{ await deleteUploadFile(req?.file?.path) }catch(err){null} 
          res.status(400).json(error)
      } 
})


export default handler;