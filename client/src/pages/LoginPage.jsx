import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "../components/AuthForm.jsx";
import { AuthLayout } from "../components/AuthLayout.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getErrorMessage } from "../lib/errors.js";
import { login } from "../services/auth.js";

export const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { login: saveAuth } = useAuth();

  return (
    <AuthLayout
      title="Login"
      subtitle="Manage job applications, interview stages, and role details from a single dashboard."
      footerLabel="New here?"
      footerLink="/register"
      footerText="Sign in with your email and password to continue to your application board."
    >
      <AuthForm
        submitLabel="Login"
        errorMessage={errorMessage}
        isLoading={isLoading}
        onSubmit={async ({ email, password }) => {
          setErrorMessage("");
          setIsLoading(true);

          try {
            const response = await login(email, password);
            saveAuth(response);
            navigate("/");
          } catch (error) {
            setErrorMessage(getErrorMessage(error, "Unable to login"));
          } finally {
            setIsLoading(false);
          }
        }}
      />
    </AuthLayout>
  );
};
