import React from "react"
import Document , {Head , Html,NextScript , Main} from "next/document"

export default class document extends Document {
    
    render(){
        return (
            <Html>
                <Head>
 
                    <link href="https://fonts.googleapis.com/css2?family=Lato:wght@700&family=Roboto+Slab&family=Roboto:ital,wght@0,400;0,500;0,700;1,500&display=swap" rel="stylesheet"/>

                </Head>
                <body>
                    <Main/>
                    <NextScript/>
                </body>
            </Html>
        )
    }

}