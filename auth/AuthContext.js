import React,{ createContext, useContext  } from "react";
import axios from "axios"
import { LinearProgress } from "@mui/material";  
import { decode as decodeBase64 } from "js-base64";
const AuthContext = createContext()

export function useAuth(){
    return useContext(AuthContext)
}


var onchange
function onAuthChange(onChnage){
    onchange = onChnage
}

export async function signIn(email , password){
 
       const {data} = await axios.post("/api/auth/signin",{
           email,
           password
       })
     
      // why new Promise(resolve , reject) not worked here
        if(data.type === "ERROR"){
           return Promise.reject(data)
        }
     
        if(onchange) onchange(data.token)
        return Promise.resolve(data.token)
    
}

export async function createUser(body){
    const {data} = await axios.post("/api/auth/register",body)

    if(data.type === "SUCCESS") {
        if(onchange) onchange(data.token)
        return Promise.resolve(data.token)
    }
   
    return Promise.reject(data?.err)
          
}

async function isAuthinticated(){
    const {data} = await axios.post("/api/auth/session",{},{"withCredentials" : true})
 
    if(data.type === "SUCCESS"){return Promise.resolve(data.token)}
    else return Promise.reject({name : data.name,isRefreshExists : data.isRefreshTokenExists})
}

async function refreshToken(){
    const {data} = await axios.post("/api/auth/refreshtoken")

    if(data.type === "SUCCESS") return Promise.resolve(data.token)
    else return Promise.reject(data.name)
    

}

export async function logOut(){
    const {data} = await axios.post("/api/auth/logout")
    if(data.type === "SUCCESS"){
        if(onchange) onchange(null)
        return Promise.resolve()
    }

    return Promise.reject()
}



function getAuthStatus(session){ 
     if(session === null) return "UNUTHENTICATED"
     else if(typeof session === "undefined") return "LOADING"
     else return "AUTHENTICATED"
}



export function AuthProvider({children,session}){


    const [stateSession , setSession] = React.useState(session)

   
    React.useEffect(()=>{ 

        onAuthChange((sess)=>{ 
            setSession(sess)
        })
  
         // session not specified from the server side 
        if(typeof session === "undefined"){ 
  
                isAuthinticated().then(token=>{  
                    setSession(token)
                })
                .catch(err=>{ 
 
                        if(err.isRefreshExists){
                            refreshToken()
                            .then(token=>{
                                setSession(token)
                            })
                            .catch(()=>{
                                setSession(null)
                            })
                        }else{
                            setSession(null)
                        }
                }) 
        }

    },[])

   
    
    if(typeof stateSession === "undefined") return <LinearProgress/>
  
    return (
        <AuthContext.Provider value={{session : stateSession && decodeBase64(stateSession.split(".")[1]), status : getAuthStatus(stateSession)}}>
            {children}
         </AuthContext.Provider> 
    )
}


