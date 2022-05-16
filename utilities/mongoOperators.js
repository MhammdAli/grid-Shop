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

function startOpr(opr){
    switch(opr){ 
        case "equals" : return "^"
        case "startWith" : return "^"
        default : return ""
    }
}

function endWithOpr(opr){
    switch(opr){  
        case "endWith" : return "$"
        case "equals" : return "$"
        default : return ""
    }
}



export function handleTextOperator(path , operator , value){
   
    if(operator!==-1){ 
        var compare = {}
        compare[path] = new RegExp(startOpr(operator) + value + endWithOpr(operator),"i")
        return compare
    }
 
}