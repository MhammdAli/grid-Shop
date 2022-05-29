import { connect  } from "../../../config/dbConn"
import {addProduct, getAllProducts} from "../../../models/products/products" 
import {validate} from "../../../utilities/Validation"
import { handleTextOperator} from "../../../utilities/mongoOperators";
import nc from "next-connect";
import {NoMatchEndpoint,errorHandler} from "../../../middlewares/errorMiddlewares"
import {uploader,deleteUploadFile} from "../../../lib/Uploader";
import { hasPermission , PERMISSIONS} from "../../../middlewares/hasPermission";
import  {isAuth} from "../../../utilities/tokens_utilities"
const handler = nc({
    onNoMatch : NoMatchEndpoint,
    onError : errorHandler
})

export const config = {
    api: {
      bodyParser: false,
    },
};

const upload = uploader("public/imgs/products",{fileSize : 200 * 1000 * 1000 * 1000})

 
handler.post(isAuth(),hasPermission(PERMISSIONS.WRITE_PRODUCTS),upload.single("avatar"),async (req,res)=>{
 
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
    } = req.body
 
 
    await connect() 
 
    try{
      const product = await addProduct({
            name,
            slugName,
            category : {
                main : mainCategory,
                sub : subCategory
            },
            image : req.file && req.file?.filename,
            price,
            stocks : stockNames ? JSON.parse(stockNames) : [],
            discount,
            brand, 
            description,
            ItemDetails : ItemDetails ? JSON.parse(ItemDetails) : []
      })
   
      
      res.status(200).json({ product , type : "success"})
    }catch(error){
        try{ await deleteUploadFile(req?.file?.path) }catch(err){null}

        res.status(400).json(error)
    } 

})



const validateGet = validate({
    page : { 
        required : [true,"page is required"],
        match : {
            validator : (page)=>parseInt(page) >= 0,
            message : "page must be greater or equal than 0"
        }
    },
    pageSize : {  
        default : 20,
        match : {
            validator : (pageSize)=>pageSize >0 && pageSize <=100,
            message : "page Size must be between 1 and 100"
        }
    },
    mainCategory : {
        path : "category.main",
        calculated : (field , operator , value)=>{
            return handleTextOperator("category.main",operator,value)
        }
    },
    subCategory : {
        path : "category.sub", 
        calculated : (field , operator , value)=>{
            return handleTextOperator("category.sub",operator,value)
        }
    },
    name : {
        path : "name",
        calculated : (field , operator , value)=>{
            return handleTextOperator("name",operator,value)
        }
    }
})

handler.get(validateGet,async (req,res)=>{ 

    if(req.result.type === "ERROR") return res.status(400).json(req.result.error)

    const {
        page ,
        pageSize
    } = req.query 

    await connect()
     
    try{ 
       const result = await getAllProducts(
          req.result.search
       ,page , pageSize)
       res.json({result})
    }catch(error){
        res.json({error})
    }
 
})

 


export default handler;