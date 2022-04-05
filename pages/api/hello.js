// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {connect,disconnect} from "../../config/dbConn"
import {addProduct} from "../../models/products/products"
export default async function handler(req, res) {
 
  const {
      name,
      slugName,
      mainCategory,
      subCategory,
      image,
      price,
      barnd,
      rating,
      numReviews,
      countInStock,
      description
  } = req.body

  await connect()
  // const products = await getAllProducts()
  try{
    const product = await addProduct({
          name,
          slugName,
          category : {
              main : mainCategory,
              sub : subCategory
          },
          image,
          price,
          barnd,
          rating,
          numReviews,
          countInStock,
          description
    })

    res.status(200).json({ product , type : "success"})
  }catch(err){
    res.status(200).json({ err , type : "error"})
  }
  await disconnect()
  
  
}
