import NextLink from "next/link"
import {Link} from "@mui/material"
import React from 'react';

const Customrouting = ({children,route,disableDecoration = false,color}) => {

    if(typeof route === "undefined") throw new Error("route props is required")

    return ( 
       <NextLink href={route} passHref>
           <Link sx={{textDecoration : (disableDecoration ? "none" : ""),color : color ? color : "" }}>
              {children}
           </Link>
       </NextLink>
    )
}

export default Customrouting;


 