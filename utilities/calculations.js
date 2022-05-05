export function calculateTax(itemsPrice){
    return itemsPrice * .15
}

export function calculateShippingPrice(itemsPrice) { 
    return itemsPrice > 200 ? 0 : 15
}

export function formatToCurrency(amount,currency){
    const price = parseFloat(amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,"))
    if(typeof currency === "undefined") return price
    return convertCurrencyToSymbol(currency) + price
}

function convertCurrencyToSymbol(currency){
    if(typeof currency !== "string") throw new Error("currency must be string")
    switch(currency.toUpperCase()){
        case "USD" : return "$"
        case "EUR" : return "€"
        default : return currency
    }
}