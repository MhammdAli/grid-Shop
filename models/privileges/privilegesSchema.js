import mongoose from "mongoose";
 
const privilegesSchema = new mongoose.Schema({
     name : {
         type : String,
         required : [true,"privilege Name is required"],
         unique : true
     }
})
 
export const privilegesModel = mongoose.models.privileges || mongoose.model("privileges",privilegesSchema)
