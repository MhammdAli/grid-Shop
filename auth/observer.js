/*
*   implement observer design pattern
*/
export class subject{
    #observers = []
    subscribe(fn){
       if(typeof fn !== "function") throw new Error("Subscribe must has a function parameter")
       this.#observers.push(fn)
       return ()=>{
           this.#observers = this.#observers.filter((subscriber)=>subscriber !== fn)
       }
    }

    emit(state){
        this.#observers.forEach((subscriber)=>{
            subscriber.call(this,state)
        })
    }
}

