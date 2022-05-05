const operators = {
    numberPattern : ["eq","gt","lt","lte","gte"],
    datePattern   : ["year" , "month" , "dayOfMonth","eq"] 
}

export function handleNumbersOperator(operator,value){
    if(!operators.numberPattern.includes(operator))  throw new Error("invalid Pattern")
    var compareWith={}
    return compareWith["$" + operator] = value
}

export function handleDateOperator(path , operator , value){
    if(!operators.datePattern.includes(operator)) throw new Error("invalid pattern")
    if(operator!==-1){
        operator = "$" + operator 
        var compareWith={}
        compareWith[operator] = `$${path}`
        return {$expr : { $eq : [compareWith,value]}}
    }

    const data = {}
    data[path] = value
    return data
}