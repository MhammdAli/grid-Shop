import React,{ createContext , useReducer ,useEffect, useContext} from "react"; 
import {loadStoreFromLocalStorage} from "./actions";
import { ADD_USER_INFO,ADD_TO_CART,CHANGE_DARK_MODE, REMOVE_FROM_CART , REMOVE_ALL_CART, UPDATE_FROM_CART, ADD_SHIPPING_ADDRESS, ADD_PAYMENT_METHOD, LOAD_STORE_FROM_LOCALSTORAGE} from "./actions/types";
import { useAuth } from "../auth/AuthContext";
const Store = createContext()

const initialState = {
    darkMode :  false,
    cart : [
        
    ],
    shippingAddress : {},
    paymentMethod : null,
    userInfo : null
} 
 
export function useStore(){ 
    return useContext(Store)
}

function reducer(state , action){
 
    switch(action.type){
        
        case CHANGE_DARK_MODE : { 
            return {
                ...state ,
                darkMode : action.darkMode
            }
        } 

        case LOAD_STORE_FROM_LOCALSTORAGE : { 
            return {
                ...state,
                ...action.store
            }
        }

        case UPDATE_FROM_CART : { 
            const existsItem = {...state.cart[action.productIndex]} 
            
            existsItem.quantity = action.newQuantity

            const newCart = state.cart.map((item)=>item.product._id === existsItem.product._id ? existsItem : item ) 
            const prefix = action.prefix || ""
            localStorage.setItem(`${prefix}_cartItems`,JSON.stringify(newCart))
            return {...state , cart : newCart} 

        }

        case ADD_TO_CART : { 
            const prefix = action.prefix || ""
            const newItem = action?.payload  
            const newCart = [...state.cart , newItem]
            localStorage.setItem(`${prefix}_cartItems`,JSON.stringify(newCart))
            return {...state , cart : newCart} 
        }

        case REMOVE_FROM_CART : {
            const prefix = action.prefix || ""
            const cartItems = state.cart.filter((cartItem)=> cartItem.product._id !== action.productId)
           localStorage.setItem(`${prefix}_cartItems`,JSON.stringify(cartItems))
            return {
                ...state,
                cart : cartItems
            }
        }

        case REMOVE_ALL_CART : { 
            const prefix = action.prefix || ""
            localStorage.removeItem(`${prefix}_cartItems`)
            return {
                ...state,
                cart : []
            }
        }

        case ADD_SHIPPING_ADDRESS : {
            const prefix = action.prefix || ""
            localStorage.setItem(`${prefix}_shippingAddress`,JSON.stringify(action.userAddress))
            return {
                ...state,
                shippingAddress : {
                    ...action.userAddress
                }
            }
        }

        case ADD_PAYMENT_METHOD : {
            const prefix = action.prefix || ""
            localStorage.setItem(`${prefix}_paymentMethod`,action.paymentMethod)

            return {
                ...state,
                paymentMethod: action.paymentMethod
            }
        }

        case ADD_USER_INFO : { 
            
            return {
                ...state,
                userInfo : {
                    ...state.userInfo,
                    ...action.userInfo
                }
            }
        }
 

       
        default : return state;
    }
}

export function StoreProvider({children}){
    const [state,dispatch] = useReducer(reducer , initialState)
    const value = {state,dispatch} 
    const {session} = useAuth()
    useEffect(()=>{  
        dispatch(loadStoreFromLocalStorage(session ? session.UID : null))   
    },[session])
   
    return(
        <Store.Provider value={value}>
            {children}
        </Store.Provider>
    )

}