import React,{ createContext, useContext  } from "react";
import axios from "axios"
import { LinearProgress } from "@mui/material";  
import { decode as decodeBase64 } from "js-base64";
import {subject} from "./observer";

const AuthContext = createContext()

export function useAuth(){
    return useContext(AuthContext)
}

// subscribe on Auth Change Channel
const authChnage = new subject()
/*
*  onChange is a function which is used to subscribe for each auth change
*  @return
*    it return unsubscribe function to unsubscribe from the channel
*/
function onAuthChange(onChnage){
    return authChnage.subscribe(onChnage) 
}
////////////////////////////

export async function signIn(email , password){
 
    const {data} = await axios.post("/api/auth/signin",{
        email,
        password
    })
    
    // why new Promise(resolve , reject) not worked here
    if(data.type === "ERROR"){
        return Promise.reject(data)
    }
    
    authChnage.emit(data?.token) 
    return Promise.resolve(data.token)
    
}

export async function createUser(body){
    const {data} = await axios.post("/api/auth/register",body)

    if(data.type === "SUCCESS") {
        authChnage.emit(data?.token) 
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
        
        authChnage.emit(null)
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

        const unsubscribe = onAuthChange((sess)=>{ 
            setSession(sess)
        })


        return unsubscribe

    },[])

   
    
    if(typeof stateSession === "undefined") return <LinearProgress/>
  
    return (
        <AuthContext.Provider value={{session : stateSession && JSON.parse(decodeBase64(stateSession.split(".")[1])), status : getAuthStatus(stateSession)}}>
            {children}
         </AuthContext.Provider> 
    )
}


