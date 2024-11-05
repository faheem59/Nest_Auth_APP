import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginDto {
  email: string;
  password: string;
}

const useLogin = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<LoginDto>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

  const onSubmit = async (data: LoginDto) => {
    setLoading(true);
    setErrorMessage(null);
    try {
        const response = await axios.post('http://localhost:3000/auth/login', data);
        
        console.log('Login successful:', response.data.token);
        localStorage.setItem('User',JSON.stringify(response.data));
        // Handle successful login (e.g., store token, redirect, etc.)
        navigate('/');
    } catch (error:any) {
      if (error.response) {
        setErrorMessage(error.response.data.message || 'Failed to login');
      } else {
        setErrorMessage('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    control,
    handleSubmit,
    onSubmit,
    errors,
    loading,
    errorMessage,
  };
};

export default useLogin;
