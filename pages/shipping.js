import React ,{useState} from 'react'; 
import { Box  , TextField , Button, Container} from '@mui/material';
import {useAuth} from "../auth/AuthContext";  
import { useRouter } from 'next/router'; 
import Sectionsplitter from "../components/sectionSplitter"
import Checkoutwizard from '../components/CheckOutWizard';
import {useStore} from "../store/store";
import {addShippingAddress} from "../store/actions"
const Shipping = () => {
 
    const {session,status} = useAuth()

    const router = useRouter()
    
    const {state,dispatch} = useStore()

    const [errors ] = useState() 
    React.useEffect(()=>{
        if(status === "UNUTHENTICATED"){
            router.replace("/signin?redirect=shipping")
        }
    },[])

    const [shipping , setShipping] = useState();  

    React.useState(()=>{
        setShipping(state.shippingAddress)
    },[state.shippingAddress])

    function handleShippingCart(event){
        event.preventDefault() 

        const { 
            street : {value : streetVal},
            city : {value : cityVal},
            postCode : {value : postCodeVal},
            country  : {value : countryVal}
        } = event.target
 
        dispatch(addShippingAddress(session.UID,{ 
            street : streetVal,
            city : cityVal,
            postCode : postCodeVal,
            country : countryVal
        }))

        router.push("/payment")
 
    }
 

    return (
        <Container sx={{my : 2}}>
            <Checkoutwizard activeStep={1}/>
            
            <Box sx={{my : 2,mx : {md : "auto"}, width : {md : "70%"}}}>
                <Sectionsplitter variant='h2' title="Shipping Address"/>
                <form onSubmit={handleShippingCart}>   
                
                    <TextField
                        value={shipping?.street }
                        type="text"
                        required variant="outlined" label="street" margin="normal" fullWidth size="small"  
                        name="street"
                        onChange={({value})=>{
                            setShipping({ 
                                ...shipping,
                                street : value
                            })
                        }}
                        helperText={(errors?.lastName && errors.lastName.message)} error={Boolean(errors?.lastName)}
                    />  
                        
                    <TextField
                        value={shipping?.city }
                        type="text"
                        required variant="outlined" label="City" margin="normal" fullWidth size="small"
                        name="city" 
                        onChange={({value})=>{
                            setShipping({
                                ...shipping,
                                city : value
                            })
                        }}
                        helperText={(errors?.email && errors.email.message)} error={Boolean(errors?.email)}
                    /> 
                    <TextField
                        value={shipping?.postCode }
                        type="text"
                        onChange={({value})=>{
                            setShipping({
                                ...shipping,
                                postCode : value
                            })
                        }}
                        required variant="outlined" label="Zip/Post Code" margin="normal" fullWidth size="small" 
                        name="postCode"
                        helperText={(errors?.password && errors.password.message)} error={Boolean(errors?.password)}
                    /> 

                    <TextField
                        value={shipping?.country }
                        onChange={({value})=>{
                            setShipping({
                                ...shipping,
                                country : value
                            })
                        }}
                        type="text"
                        required variant="outlined" label="country" margin="normal" fullWidth size="small" 
                        name="country"
                        helperText={(errors?.password && errors.password.message)} error={Boolean(errors?.password)}
                    /> 
                    
                    <Button fullWidth variant="contained" sx={{my : 2,borderRadius : 0}} type="submit">Continue</Button>
                </form>
                
            </Box>
        </Container>
    );
}

export default Shipping;
