import React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import './StepperFun.css';

const steps: string[] = ['', '', ''];

const StepperFun: React.FC = () => {
  return (
    <Box className="stepper_main_box">
      <Stepper>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default StepperFun;
