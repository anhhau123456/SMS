import React from 'react';
import { CircularProgress, Backdrop } from '@mui/material';

const LoadingOverlay = ({ open  }) => (
    <Backdrop
        open={open}
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.modal + 1 }}
    >
        <CircularProgress color="inherit" />
    </Backdrop>
);

export default LoadingOverlay;