import React from 'react';
import { Button, ButtonProps } from '@mui/material';

interface CommonButtonProps extends ButtonProps {
    isLoading?: boolean;
    loadingText?: string;
}

const CommonButton: React.FC<CommonButtonProps> = ({ isLoading, loadingText, children, ...props }) => {
    return (
        <Button {...props} disabled={isLoading || props.disabled}>
            {isLoading ? loadingText || 'Loading...' : children}
        </Button>
    );
};

export default CommonButton;
