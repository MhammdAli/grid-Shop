import React,{useState , useEffect} from 'react';
import {Container,FormControl,Button,RadioGroup,FormControlLabel,Radio} from "@mui/material"
import Checkoutwizard from '../components/CheckOutWizard';
import { Box } from '@mui/system';
import Sectionsplitter from "../components/sectionSplitter.js"
import { useRouter } from 'next/router';
import { useStore } from '../store/store';
import { addPaymentMethod } from '../store/actions'; 
import {useAuth} from "../auth/AuthContext"; 
import Layout from "../components/Layout"; 
const Payment = () => {

    const router = useRouter()
    const {state , dispatch} =  useStore()
    const {session} = useAuth()
    const [paymentMethod , setPaymentMethod] = useState()
    const backHandler = ()=>{
        router.push("/shipping")
    }

    const handlePayment=()=>{
 
        dispatch(addPaymentMethod(session.UID,paymentMethod))

        router.push("/placeOrder")
    }

    useEffect(()=>{
        if(status === "UNUTHENTICATED"){
            router.replace("/signin?redirect=payment")
        }
    },[])


    return (
        <Layout>
            <Container sx={{my : 2}}>
                <Checkoutwizard activeStep={2}/>
                
                <Box sx={{my : 4,mx : {md : "auto"}, width : {md : "70%"}}}>
                    <Sectionsplitter sx={{my : 2}} variant='h2' title="Choose You Payment Method" width={200}/>
                    <FormControl> 
                        <RadioGroup 
                            defaultValue={state.paymentMethod ||"payPal"}
                            name="radio-buttons-group"
                            onChange={(event)=>{setPaymentMethod(event.target.value)}}
                        >
                            <FormControlLabel value="payPal" control={<Radio />} label="Paypal" /> 
                            <FormControlLabel value="Cash" control={<Radio />} label="Cash" />
                        </RadioGroup>
                    </FormControl>

                    <Box sx={{my : 2}}>
                        <Button sx={{my : 1}} variant="contained" fullWidth onClick={handlePayment}>Continue</Button>
                        <Button sx={{my : 1}} variant="contained" fullWidth onClick={backHandler}>Back</Button>
                    </Box>

                </Box>
            </Container> 
        </Layout>
    );
}

export default Payment;
