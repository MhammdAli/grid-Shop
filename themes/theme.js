import { createTheme } from "@mui/material";
export function useTheme(isDarkMode){
    const theme =  createTheme({
        palette : {
            mode : isDarkMode ? "dark" : "light",
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
                main : "#208080"
            }
        },
        typography : { 
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

    return {theme}
}