import mongoose from "mongoose";
 
const categorySchema = new mongoose.Schema({
     mainCategory : {
          type : String,
          required : [true, "main Category is required"],
          unique : true
     },
     subCategory : String
})
 
export const Category = mongoose.models.category || mongoose.model("category",categorySchema)
