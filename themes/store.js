import React,{ createContext , useReducer ,useEffect, useContext} from "react"; 
const Store = createContext()
const initialState = {
    darkMode :  false
} 

export function useDarkMode(){
    return useContext(Store)
}
function reducer(state , action){
    switch(action.type){
        case "DARK_MODE_ON" : {  
            return {...state,darkMode : true};
        }
        case "DARK_MODE_OFF" : { 
            return {...state , darkMode : false}
        }
        default : return state;
    }
}

export function StoreProvider({children}){
    const [state,dispatch] = useReducer(reducer , initialState)
    const value = {state,dispatch} 

    useEffect(()=>{ 
        dispatch({type : localStorage.getItem("darkMode") ? "DARK_MODE_ON" : "DARK_MODE_OFF"}) 
    },[])
   
    return <Store.Provider value={value}>{children}</Store.Provider>
}