import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/form.scss";
import Alert from "../alert/Alert";
import { useApi } from "../../hooks/useApi";

export default function forgot_password() {
  const [email, setEmail] = useState("");

  const [alert, setAlert] = useState({});

  const { post } = useApi();

  const handleSuccess = () => {
    setAlert({
      message: "A reset password link has been sent to your email",
      type: "success",
    });
    setEmail("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // const data = { email };

    const res = await post("auth/forgot-password", {
      data: { email },
      onSuccess: (res) => handleSuccess(res),
      onFailure: (err) => setAlert(err),
    });
  };

  return (
    <>
      <Alert data={alert} />
      <form className="form form--page" onSubmit={handleSubmit}>
        <div className="form__group form__group--page">
          <label className="form__label">Email</label>
          <input
            className="form__field"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form__group form__group--page">
          <input className="form__btn" type="submit" value="Submit" />
        </div>

        <footer>
          Remembered your password? <Link to="/login">Login</Link>
        </footer>
      </form>
    </>
  );
}
