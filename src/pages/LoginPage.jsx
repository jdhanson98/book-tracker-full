import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { useAuth } from "../context/AuthContext";

function getFirebaseErrorMessage(errorCode) {
  const errorMessages = {
    "auth/invalid-email": "Please enter a valid email address.",

    "auth/invalid-credential": "The email or password is incorrect.",

    "auth/user-disabled": "This account has been disabled.",

    "auth/too-many-requests": "Too many unsuccessful attempts. Please try again later.",
  };

  return errorMessages[errorCode] ?? "Unable to log in. Please try again.";
}

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setErrorMessage("");

    try {
      setIsSubmitting(true);

      await login(email.trim(), password);

      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);

      setErrorMessage(getFirebaseErrorMessage(error.code));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h1 className="h3 text-center mb-4">Log In</h1>

              {errorMessage && (
                <div className="alert alert-danger" role="alert">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label" htmlFor="login-email">
                    Email address
                  </label>

                  <input
                    id="login-email"
                    className="form-control"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label" htmlFor="login-password">
                    Password
                  </label>

                  <input
                    id="login-password"
                    className="form-control"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    required
                  />
                </div>

                <button className="btn btn-primary w-100" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Logging In..." : "Log In"}
                </button>
              </form>

              <p className="text-center mt-4 mb-0">
                Don&apos;t have an account? <Link to="/register">Create one</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;
