import mongoose from "mongoose"

export const BranchSchema = new mongoose.Schema({
    branchName : {
        type : String,
        required : [true , "branch name must be specified"]
    },
    branchAddress : {
        type : String
    }
})


export const BranchModel = mongoose.models.branch || mongoose.model("branch",BranchSchema)