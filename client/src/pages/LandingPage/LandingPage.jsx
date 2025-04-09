import React from "react";
import classes from "./LandingPage.module.css";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div>
      <div className={classes.background}>
        <div className={classes.textDiv}>
          <h2>
            Bypass the Industrial, <br /> Dive into the Digital!
          </h2>
          <p>
            Before us is a golden opportunity, demanding us to take a bold step
            forward and join the new digital era.
          </p>
          <div className={classes.linkDiv}>
            <Link className={classes.createAccount} to="/users/register">
              Create Account
            </Link>
            <Link className={classes.signIn} to="/users/login">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
