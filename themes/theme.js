import { createTheme } from "@mui/material";
 
export default createTheme({
    palette : {
        type : "light",
        navBar : {
           main : "#fff",
           contrastText : "#000"
        },
        primary : {
            main : "#007fff",
            contrastText : "#fff",
            primaryText : "#007fff"
        },
        secondary : {
            color : "#208080"
        }
    },
    typography : {
        allVariants : {
            color : "#000"
        }, 
        h1 : {
            fontSize : '1.6rem',
            fontWeight : 400,
            margin : "1rem 0"
        },
        h2 : {
            fontSize : '1.4rem',
            fontWeight : 400,
            margin : "1rem 0"
        },
        CustomLink : { 
            color : "#fff",
            textDecoration : "underline",
            fontSize : 24
        }
      
    }
})