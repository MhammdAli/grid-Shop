export function calculateTax(itemsPrice){
    return itemsPrice * .15
}

export function calculateShippingPrice(itemsPrice) { 
    return itemsPrice > 200 ? 0 : 15
}

export function formatToCurrency(amount,currency){
    if(typeof currency === "undefined") return amount
    return convertCurrencyToSymbol(currency) + amount
}

function convertCurrencyToSymbol(currency){
    if(typeof currency !== "string") throw new Error("currency must be string")
    switch(currency.toUpperCase()){
        case "USD" : return "$"
        case "EUR" : return "€"
        default : return currency
    }
}