import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { useAuth } from "../context/AuthContext";

function getFirebaseErrorMessage(errorCode) {
  const errorMessages = {
    "auth/email-already-in-use": "An account already exists with this email address.",

    "auth/invalid-email": "Please enter a valid email address.",

    "auth/weak-password": "Your password is too weak. Use at least 6 characters.",

    "auth/operation-not-allowed": "Email and password registration is not enabled.",
  };

  return errorMessages[errorCode] ?? "Unable to create your account. Please try again.";
}

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setErrorMessage("");

    if (password !== confirmedPassword) {
      setErrorMessage("The passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Your password must contain at least 6 characters.");
      return;
    }

    try {
      setIsSubmitting(true);

      await register(email.trim(), password);

      navigate("/");
    } catch (error) {
      console.error("Registration failed:", error);

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
              <h1 className="h3 text-center mb-4">Create Account</h1>

              {errorMessage && (
                <div className="alert alert-danger" role="alert">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label" htmlFor="register-email">
                    Email address
                  </label>

                  <input
                    id="register-email"
                    className="form-control"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="register-password">
                    Password
                  </label>

                  <input
                    id="register-password"
                    className="form-control"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="new-password"
                    minLength="6"
                    required
                  />

                  <div className="form-text">Passwords must contain at least 6 characters.</div>
                </div>

                <div className="mb-4">
                  <label className="form-label" htmlFor="confirm-password">
                    Confirm password
                  </label>

                  <input
                    id="confirm-password"
                    className="form-control"
                    type="password"
                    value={confirmedPassword}
                    onChange={(event) => setConfirmedPassword(event.target.value)}
                    autoComplete="new-password"
                    minLength="6"
                    required
                  />
                </div>

                <button className="btn btn-primary w-100" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </button>
              </form>

              <p className="text-center mt-4 mb-0">
                Already have an account? <Link to="/login">Log in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default RegisterPage;
