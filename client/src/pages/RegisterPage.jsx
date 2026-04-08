import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "../components/AuthForm.jsx";
import { AuthLayout } from "../components/AuthLayout.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getErrorMessage } from "../lib/errors.js";
import { register } from "../services/auth.js";

export const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  return (
    <AuthLayout
      title="Register"
      subtitle="Create an account to save applications, track progress, and manage your job search more easily."
      footerLabel="Already have an account?"
      footerLink="/login"
      footerText="Set up your account to start tracking applications in one place."
    >
      <AuthForm
        submitLabel="Create Account"
        errorMessage={errorMessage}
        isLoading={isLoading}
        onSubmit={async ({ email, password }) => {
          setErrorMessage("");
          setIsLoading(true);

          try {
            const response = await register(email, password);
            login(response);
            navigate("/");
          } catch (error) {
            setErrorMessage(getErrorMessage(error, "Unable to create account"));
          } finally {
            setIsLoading(false);
          }
        }}
      />
    </AuthLayout>
  );
};
