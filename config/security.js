import bcrypt from "bcrypt"


export function hashPassword(password){
    return bcrypt.hash(password,10).then(res=>{ 
        return Promise.resolve(res) 
    })
    .catch(err=>{
        return Promise.reject(err)
    })
}

export async function comparePassword(plainPassword,hashedPassword) { 
    try{
       return await bcrypt.compare(plainPassword,hashedPassword) 
    }catch(err){return false}
}