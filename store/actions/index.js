import {CHANGE_DARK_MODE,ADD_TO_CART, REMOVE_FROM_CART, REMOVE_ALL_CART, LOAD_CART_FROM_LOCAL_STORAGE, UPDATE_FROM_CART} from "./types"

/*
* This function is used to chnage the DarkMode 
* @return 
*  1) object which carries action type and payload  
* @params
*  1) isDark if true the darkMode will be on otherwise false
* 
* NOTE : DarkMode Will Store The payload in localStorage
*/
export function changeDarkMode(isDark){
    if(typeof isDark !== "boolean") throw new Error("The First Argument must be boolean")

    return {
        type : CHANGE_DARK_MODE,
        darkMode : isDark
    }
}


/*
* This function is used to add Product To Cart
* @return 
*  1) object which carries action type and Product + quantity  
* @params
*  1) product of type object that contains information about the product
*  2) quantity of type number that contains the quantity of the ordered product
* 
*  NOTE : Add to Cart Will Store The payload in localStorage
*/
export function addToCart(product,quantity){

    if(typeof product !== "object") throw new Error("the first argument must be an Object")
    if(typeof quantity !== "number") quantity = parseInt(quantity)

    return {
        type : ADD_TO_CART,
        payload : {
            product,
            quantity
        }
    }

}

export function updateToCart(productIndex,newQuantity){
    return {
        type : UPDATE_FROM_CART,
        productIndex,
        newQuantity
    }
}


/*
* This function is used to Remove specific Product from cart by using its id
* @return 
*  1) object which carries action type and Product + product Id
* @params
*  1) productId which is used to remove specific existing product from cart
* 
*  NOTE :Remove From Cart Will Also Uodate The Cart in localStorage
*/
export function removeFromCart(productId){
    return {
        type : REMOVE_FROM_CART,
        productId
    }
}


/*
* This function is used to Remove all the cart
* @return 
*  1) object which carries action type to remove all the cart 
* 
*  NOTE : this will also remove all the carts from localstorage
*/
export function clearCart(){
    return {
        type : REMOVE_ALL_CART
    }
}


/*
* This function is used to load all the cart from localstorage and loaded it on the memory
* @return 
*  1) object which carries action type to load the cart 
* 
*/
export function loadCartFromLocalStorage(){
    return {
        type : LOAD_CART_FROM_LOCAL_STORAGE
    }
}