import { Container, Box, Typography } from "@mui/material";
import CommonTextField from "../../components/commonComponent/CommonTextField";
import CommonButton from "../../components/commonComponent/CommonButton";
import { Controller } from "react-hook-form";
import useLogin from "../../utils/customHooks/useLogin";
import "./LoginPage.scss";

const LoginPage = () => {
  const { control, handleSubmit, onSubmit, loading, errorMessage } = useLogin();

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <div className="wrapper">
        <div className="title">Login</div>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box className="field" sx={{ mb: 2 }}>
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              }}
              render={({ field }) => (
                <CommonTextField
                 control={control}
                  {...field} label="Email" type="email" />
              )}
            />
          </Box>
          <Box className="field" sx={{ mb: 2 }}>
            <Controller
              name="password"
              control={control}
              rules={{
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
              }}
              render={({ field }) => (
                <CommonTextField
                  control={control}
                  {...field} label="Password" type="password" />
              )}
            />
          </Box>

          {errorMessage && (
            <Typography color="error" gutterBottom>
              {errorMessage}
            </Typography>
          )}

          <Box sx={{ mt: 5 }}>
            <CommonButton
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              loadingText={loading ? "Logging In..." : "Login"}
              disabled={loading}
            >
              {loading ? "Logging In..." : "Login"}
            </CommonButton>
          </Box>
          <div className="login-link">
            <Typography variant="body2">
              <a href="/forgot-password">Forgot Password?</a>
            </Typography>
            <Typography variant="body2">
              <a href="/signup">Don't have an account? Sign Up</a>
            </Typography>
          </div>
        </form>
      </div>
    </Container>
  );
};

export default LoginPage;
