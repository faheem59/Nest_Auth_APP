import { Container, Box, Typography, Button } from "@mui/material";
import { useSignUp } from "../../utils/customHooks/useSignup";
import CommonTextField from "../../components/commonComponent/CommonTextField";
import CommonButton from "../../components/commonComponent/CommonButton";
import { useState } from "react";
import "./SingUpPae.scss"; 
import axios from "axios";
import { User } from "../../utils/interface/types";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const { handleSubmit, loading, onSubmit, control } = useSignUp();
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const navigate = useNavigate();
  const handleSendOtp = async () => {
    console.log("Sending OTP to:", phoneNumber);
    try {
      const response = await axios.post('http://localhost:3000/auth/otp', { phoneNumber });
      if (response) {
        console.log(response.data, 'OTP sent successfully');
        setOtpSent(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post('http://localhost:3000/auth/verify-otp', {
        phoneNumber,
        value: otp,
      });
      console.log(response.data, 'OTP verified successfully');
      setOtpVerified(true);
      alert('OTP verified successfully!');
    } catch (error) {
      console.error(error);
      alert('OTP verification failed. Please try again.');
    }
  };

  const handleFinalSubmit = (data: User) => {
    if (otpVerified) {
      // Call the original onSubmit function with the additional data
      onSubmit({ ...data, phoneNumber });
      navigate('/login')
    } else {
      alert("Please verify your OTP before signing up.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <div className="wrapper">
        <div className="title">Sign Up</div>
        <form onSubmit={handleSubmit(handleFinalSubmit)} noValidate>
          <Box className="field" sx={{ mb: 2 }}>
            <CommonTextField
              name="name"
              control={control}
              label="Name"
              rules={{ required: "Name is required" }}
            />
          </Box>
          <Box className="field" sx={{ mb: 2 }}>
            <CommonTextField
              name="email"
              control={control}
              label="Email"
              type="email"
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              }}
            />
          </Box>
          <Box className="field" sx={{ mb: 2 }}>
            <CommonTextField
              name="phoneNumber"
              control={control}
              label="Mobile No."
              type="tel"
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                setOtpSent(e.target.value.length === 10); 
              }}
              rules={{
                // required: "Phone number is required",
                minLength: {
                  value: 10,
                  message: "Phone number must be 10 digits",
                },
                maxLength: {
                  value: 10,
                  message: "Phone number must be 10 digits",
                },
              }}
            />
          </Box>
          {otpSent && (
            <Box className="otp-field" sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Click the button below to send OTP:
              </Typography>
              <Button variant="contained" onClick={handleSendOtp}>
                Send OTP
              </Button>
            </Box>
          )}
          {otpSent && (
            <Box className="otp-input" sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <CommonTextField
                name="otpValue"
                control={control}
                label="OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                sx={{ flexGrow: 1, mr: 1 }}
                rules={{
                  // required: "OTP is required",
                  minLength: {
                    value: 6,
                    message: "OTP must be 6 digits",
                  },
                  maxLength: {
                    value: 6,
                    message: "OTP must be 6 digits",
                  },
                }}
              />
              <Button variant="outlined" onClick={handleVerifyOtp} sx={{ color: "white" }}>
                Verify
              </Button>
            </Box>
          )}
          <Box className="field" sx={{ mb: 2 }}>
            <CommonTextField
              name="password"
              control={control}
              label="Password"
              type="password"
              rules={{
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
              }}
            />
          </Box>
          <Box sx={{ mt: 5 }}>
            <CommonButton
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              loadingText={loading ? "Signing Up..." : "Sign Up"}
              disabled={loading || !otpVerified} // Disable button if OTP is not verified
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </CommonButton>
          </Box>
          <div className="signup-link">
            <Typography variant="body2">
              <a href="/login">Already have an account? Login</a>
            </Typography>
          </div>
        </form>
      </div>
    </Container>
  );
};

export default SignUpPage;
