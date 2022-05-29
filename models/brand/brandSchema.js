import mongoose from "mongoose";
 
const barndSchema = new mongoose.Schema({
     brand : {
          type : String,
          unique : true
     }
})
 
export const Brand = mongoose.models.brand || mongoose.model("brand",barndSchema)
