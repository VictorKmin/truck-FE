import React from 'react';
import {Box, Checkbox, Typography} from "@material-ui/core";

const CheckboxComponent = ({text, ...props}) => {
    return (
        <Box display='flex' alignItems='center'>
            <Checkbox type='checkbox' {...props} style={{padding: '0 8px 0 0'}}/>
            <Typography variant="subtitle2">{text}</Typography>
        </Box>
    );
};

export default CheckboxComponent;