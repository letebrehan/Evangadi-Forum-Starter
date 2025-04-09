import React, { useRef, useState } from "react";
import Style from "./ForgetPassword.module.css";
import { Link, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import axiosInstance from "../../API/axios";

function ForgetPassword() {
  const emailDom = useRef(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Submit form handler
async function handleSubmit(e) {
  e.preventDefault();
  const emailValue = emailDom.current.value.trim();

  if (!emailValue) {
    setError("An email is required");
    return;
  }

  setLoading(true);
  try {
    const response = await axiosInstance.post("/users/forget-password", {
      email: emailValue,
    });

    setLoading(false);
    alert(response.data.msg); // Show success message
  } catch (err) {
    setLoading(false);
    setError(
      err.response?.data?.msg || "Something went wrong, please try again."
    );
    console.error("Error:", err.response?.data?.msg || err.message);
  }
}

  return (
    <section className={Style.container}>
      <div className={Style.card}>
        <h3>Reset your password</h3>
        <p className={Style.instruction}>
          Enter your email address below, and we will send you an email with
          instructions to reset your password.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            ref={emailDom}
            type="email"
            placeholder="Email address"
            className={error ? Style.inputError : Style.input}
          />
          {error && <p className={Style.error}>{error}</p>}

          <button className={Style.button} type="submit" disabled={loading}>
            {loading ? (
              <div className={Style.loading}>
                <ClipLoader color="#fff" size={12} />
                <span>Sending...</span>
              </div>
            ) : (
              "Reset your password"
            )}
          </button>
        </form>

        <div className={Style.linkContainer}>
          <Link to="/users/login" className={Style.link}>
            Already have an account?
          </Link>
          <Link to="/users/register" className={Style.link}>
            Don't have an account?
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ForgetPassword;
