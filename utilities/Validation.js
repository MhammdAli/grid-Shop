const emailRegexp = new RegExp(
    /^[a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1}([a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1})*[a-zA-Z0-9]@[a-zA-Z0-9][-\.]{0,1}([a-zA-Z][-\.]{0,1})*[a-zA-Z0-9]\.[a-zA-Z0-9]{1,}([\.\-]{0,1}[a-zA-Z]){0,}[a-zA-Z0-9]{0,}$/i
)

var strongPasswordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

export function isValidEmail(email){
    return emailRegexp.test(email)
}

export function isValidPassword(password){
    return strongPasswordRegex.test(password)
}

export const BODY = "body";
export const QUERY = "query";
  
export function isUndefined(value){
    return typeof value === "undefined"
}

function has(obj , key){
    if(!(typeof obj === "object")) throw new Error("the first arg must be object");
    // eslint-disable-next-line no-prototype-builtins
    return obj.hasOwnProperty(key)
}

// function isBandType(value , bandType){
//     if(!Array.isArray(bandType)) throw new Error("must be an array")
     
//     return bandType.some((band)=>{ 
//        return band(value)
//     }) 

// } 

// && !isBandType(query[field],fieldRules?.omit || [])

export function validate(schema,type = QUERY){
    if(typeof type !== "string") throw new Error("type must be string")
    type = type.toLowerCase()
    if(!(type === QUERY || type === BODY)) throw new Error("type must be query or body")
    if(typeof schema !== "object" || Array.isArray(schema)) throw new Error("schema must be an single json object")
      return (req,res,next)=>{  
         const myFields = Object.keys(schema)
         const query = req[type]

         if(req?.result && req.result?.type === "ERROR") next(); 

        req.result = myFields.reduce((agg,field)=>{
 
            const fieldRules = schema[field];
  
            if(has(fieldRules,"path") && has(query,field)) {
                var value = query[field]
                if(has(fieldRules,"calculated")){
                    const pattern = query?.pattern || ""
                    const split = pattern.split(":") 
                    const operatorIndex = split.findIndex((item)=>item === field) 
                    try{ 
                      value = fieldRules.calculated(field,split[operatorIndex + 1],value)
                    }catch(err){
                        agg.error[field] = {
                            message : err.message
                        }       
                        agg.type = "ERROR"
                    }


                }else{
                    const data = {}
                    data[field] = {"$eq" : value}
                    value = data
                }

                
                agg.search = {
                    ...agg.search,
                    ...value
                } 
            } 
            else if(!has(query,field) && has(fieldRules,"default")) query[field] = fieldRules.default
            else if((Array.isArray(fieldRules?.required) ? fieldRules?.required[0] : fieldRules?.required) && !has(query,field)){
                agg.error[field] = {
                    message : Array.isArray(fieldRules?.required) ? fieldRules.required[1] : field + " is required" 
                }       
                agg.type = "ERROR"
            }
            else if((has(fieldRules,"match")  && !fieldRules?.match?.validator.call(req?.user,query[field]))){
   
                agg.error[field] = {
                    message : schema[field]?.match?.message
                }
                
                agg.type = "ERROR"
            }
            

            return agg; 


         },{error : {} , search : {} , type : "SUCCESS"})
 
         if(req.result.type === "ERROR") delete req.result.search

         next()
     }
     
 }
 


