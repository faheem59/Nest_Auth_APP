import { SubmitHandler, useForm } from "react-hook-form";
import { User } from "../interface/types"; // Ensure this has name, email, password, and phonenumber
import axios from "axios";
import { useState } from "react";

interface SignUpResponse {
    token: string;
}

export const useSignUp = () => {
    const [error] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false); 
    const { register, handleSubmit, control, formState: { errors } } = useForm<User>();

    const signUp = async (user: User): Promise<void> => {
        setLoading(true); 
        try {
            const response = await axios.post<SignUpResponse>('http://localhost:3000/auth/signup', user);
            const { token } = response.data;
            localStorage.setItem('token', token);
        } catch (error) {
            console.error(error);
            // const errorMessage = error?.response?.data?.message || 'SignUp failed';
            // setError(error);
        } finally {
            setLoading(false); 
        }
    };

    const onSubmit: SubmitHandler<User> = (data) => {
        console.log(data, "User Data being sent to signup");
        signUp(data);
    };

    return {
        register,
        handleSubmit,
        control,
        onSubmit,
        formErrors: errors,
        error,
        loading
    };
};
