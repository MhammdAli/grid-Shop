import {CircularProgress, Container} from "@mui/material"

function Loader() {
    return (
         <Container sx={{"display" : "flex",justifyContent : "center"}}>
            <CircularProgress color="primary" />
         </Container>
    )
}

export default Loader
