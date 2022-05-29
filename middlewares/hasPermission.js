export const PERMISSIONS = {
    READ_USER : "READ:USER",
    SEND_EMAIL_USER : "SEND:EMAIL:USER",
    WRITE_USER : "WRITE:USER",
    DELETE_USER : "DELETE:USER",
    READ_PRODUCTS : "READ:PRODUCTS",
    EDIT_PRODUCTS : "EDIT:PRODUCTS",
    WRITE_PRODUCTS : "WRITE:PRODUCTS",
    READ_BRANCH : "READ:BRANCH",
    WRITE_BRANCH : "WRITE:BRANCH",
    READ_CATEGORY : "READ:CATEGORY",
    WRITE_CATEGORY : "WRITE_CATEGORY",
    READ_BRAND : "READ:BRAND",
    WRITE_BRAND : "WRITE:BRAND",
    GRANT_ROLES : "GRANT:ROLES",
    GRANT_OWN_ROLES : "GRANT:OWN:ROLES",
    REVOKE_OWN_ROLES : "REVOKE:OWN:ROLES",
    REVOKE_ROLES : "REVOKE:ROLES",
    READ_ORDERS : "READ:ORDERS",
    WRITE_ORDERS : "WRITE:ORDERS"
 }

export function hasPermission(roles,listners){ 
   
    if(!(typeof listners?.onSuccess === "function" || typeof listners?.onSuccess === "undefined")) throw new Error("onSuccess must be a function");
    if(!(typeof listners?.onError === "function" || typeof listners?.onError === "undefined")) throw new Error("onError must be a function");
   
    return (req,res,next)=>{
        const user = req.user;
        
        if( user?.isAdmin || CheckPermission(user.roles,roles)){
          
            if(listners?.onSuccess) return listners?.onSuccess(req,res,next);
            return next(); 
        }
    
        if(listners?.onError) return listners?.onError(req,res,next);

        res.status(403).json({name : "UNAUTHORIZED",message : "no Permission"})
    }
}

export function CheckPermission(userRoles,accessRoles){
     if(typeof accessRoles === "string") accessRoles = [accessRoles];
     if(!Array.isArray(accessRoles)) throw new Error("accessRoles parameter must be an array")
     if(!Array.isArray(userRoles)) userRoles = [];

     return accessRoles.some((role)=>userRoles.includes(role))
}