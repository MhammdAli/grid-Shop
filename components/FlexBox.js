import { styled } from "@mui/styles";
import { Box } from "@mui/system";

export const FlexBox = styled(Box)(({theme})=>({
    display : "flex",
    justifyContent : "space-between",
    alignItems : "center"
}))