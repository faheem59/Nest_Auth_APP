/* eslint-disable @typescript-eslint/no-explicit-any */

import { TextField, TextFieldProps } from '@mui/material';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface CommonTextFieldProps<T extends FieldValues> extends Omit<TextFieldProps, 'name'> {
  name: Path<T>;
  control: Control<T>;
  rules?: any;
  label: string;
  variant?: 'outlined' | 'filled' | 'standard';
  type?: string;
  fullWidth?: boolean;
  margin?: 'none' | 'dense' | 'normal';
}

const CommonTextField = <T extends FieldValues>({
  name,
  control,
  label,
  variant = 'outlined',
  type = 'text',
  fullWidth = true,
  margin = 'normal',
  rules,
  ...rest
}: CommonTextFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          label={label}
          variant={variant}
          type={type}
          fullWidth={fullWidth}
          margin={margin}
          error={!!fieldState.error}
          helperText={fieldState.error ? fieldState.error.message : ''}
          InputProps={{
            style: {
              border:"none",
              borderRadius: '25px',
            },
          }}
          {...rest}
        />
      )}
    />
  );
};

export default CommonTextField;
