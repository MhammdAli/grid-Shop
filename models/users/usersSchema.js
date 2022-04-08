import mongoose from "mongoose";
import { isValidEmail ,isValidPassword} from "../../utilities/Validation";
import {hashPassword} from "../../config/security";

const UserSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : [true,"First Name is required"],
        minlength : [6,"First Name must be min 6 characters"]
    },
    lastName : {
        type : String,
        required : [true,"Last Name is required"],
        minlength : [6,"LastName Name must be min 6 characters"]
    },
    email : {
        type : String,
        required : [true , "Email is Required"],
        validate : {
            validator : (email) => isValidEmail(email),
            message : "{PATH} is not Valid ...",
            type : "INVALID_EMAIL"
        }, 
        unique : true,
        lowercase : true
    },
    password : {
        type : String,
        required : [true , "Password is Required"],
        validate : {
            validator : (pass) => isValidPassword(pass),
            message : "weak password ...",
            type : "WEAK_PASSWORD"
        },
        select : false
    },
    imageUrl : {
        type : String
    },
    
},{timestamps : true})


/*
*  This middleware is used to encrypt password before insert it in database
*/
UserSchema.pre("save",async function(next){ 
    const password = this.password  
    try{
        this.password = await hashPassword(password)
    }catch(err){
        next({"message" : "Somthing went Wrong!!","name" : "INSERTED_USER_WRONG"})
    } 
})

 
 
export const UserModel =  mongoose.models.user || mongoose.model("user",UserSchema)
