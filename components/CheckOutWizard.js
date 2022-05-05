import { Step, StepLabel, Stepper } from '@mui/material';
import React from 'react';

const Checkoutwizard = ({activeStep = 0,sx}) => {
    return (
        <>
        <Stepper activeStep={activeStep} alternativeLabel sx={sx}>
            {
            ["Login","Shipping Address", "Payment Method" , "Place Order"].map((step=>(
                <Step key={step}><StepLabel>{step}</StepLabel></Step>
            )))
           }
        </Stepper>
        
        </>

    );
}

export default Checkoutwizard;
