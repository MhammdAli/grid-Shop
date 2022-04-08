import React,{ createContext , useReducer ,useEffect, useContext} from "react"; 
import { changeDarkMode, loadCartFromLocalStorage } from "./actions";
import { ADD_TO_CART,CHANGE_DARK_MODE, REMOVE_FROM_CART , REMOVE_ALL_CART, LOAD_CART_FROM_LOCAL_STORAGE, UPDATE_FROM_CART} from "./actions/types";

const Store = createContext()

const initialState = {
    darkMode :  false,
    cart : [
        
    ]
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

        case LOAD_CART_FROM_LOCAL_STORAGE : {
            const cartItems = localStorage.getItem("cartItems")
            if(typeof cartItems === "undefined") return {...state}
            else
            return {
               ...state,
               cart : JSON.parse(cartItems)
            }
        }

        case UPDATE_FROM_CART : { 
            const existsItem = {...state.cart[action.productIndex]} 

            existsItem.quantity = action.newQuantity

            const newCart = state.cart.map((item)=>item.product._id === existsItem.product._id ? existsItem : item ) 
  
            localStorage.setItem("cartItems",JSON.stringify(newCart))
            return {...state , cart : newCart} 

        }

        case ADD_TO_CART : { 
            const newItem = action?.payload
           // const existsItem  = state.cart.find(({product : {_id}})=> _id === newItem.product._id);
           // var newCart = []
            // if(existsItem){  
            //     existsItem.quantity += newItem.quantity
            //     // const countInStock = newItem?.product?.stocks.reduce((acc,item)=>acc + item.countInStock,0)
            //     // if(existsItem.quantity > countInStock) existsItem.quantity = countInStock

            //     newCart = state.cart.map((item)=>item.product._id === existsItem.product._id ? existsItem : item ) 
            // }else{
            //     newCart = [...state.cart ,    
            //       newItem 
            //     ] 
            // }
 
            const newCart = [...state.cart , newItem]
            localStorage.setItem("cartItems",JSON.stringify(newCart))
            return {...state , cart : newCart} 
        }

        case REMOVE_FROM_CART : {
            const cartItems = state.cart.filter((cartItem)=> cartItem.product._id !== action.productId)
           localStorage.setItem("cartItems",JSON.stringify(cartItems))
            return {
                ...state,
                cart : cartItems
            }
        }

        case REMOVE_ALL_CART : {
            localStorage.removeItem("cartItems")
            return {
                ...state,
                cart : []
            }
        }

        default : return state;
    }
}

export function StoreProvider({children}){
    const [state,dispatch] = useReducer(reducer , initialState)
    const value = {state,dispatch} 

    useEffect(()=>{ 
        dispatch(changeDarkMode(localStorage.getItem("darkMode") === "true" ? true : false))  
        dispatch(loadCartFromLocalStorage())    
    },[])
   
    return(
        <Store.Provider value={value}>
            {children}
        </Store.Provider>
    )

}