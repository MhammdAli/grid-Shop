export function omit(doc , fields){
    
    if(!Array.isArray(fields) && typeof fields !== "string") throw new Error("fileds param must be array or string")
    if(typeof doc !== "object") throw new Error("doc param must be a object")
    
    // convert filds to array if it is string
    if(fields === "string") fields = [fields]

    fields.forEach(field=>{
        delete doc[field]
    })
    
    return doc

}