import mongoose from "mongoose";
 
const barndSchema = new mongoose.Schema({
     brand : String
})
 
export const Brand = mongoose.models.brand || mongoose.model("brand",barndSchema)
