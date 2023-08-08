import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Container, Form, Button } from "react-bootstrap";
import { getError } from "../utils";
import { loginHandler } from "../stateManagment/reducer/loginReducer";
import axios from "axios";
import { toast } from "react-toastify";

export const Register = (props) => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (password !== confirmPassword) {
      toast.error("passwords are not same");
      return;
    }
    try {
      const { data } = await axios.post("/api/users/signup", {
        name,
        email,
        password,
      });

      props.loginHandler(data);
      navigate(redirect || "/");
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (props.userData) {
      navigate(redirect);
    }
  }, [navigate, redirect, props.userData]);

  return (
    <Container className="small-container">
      <Helmet>
        <title>Sign Up</title>
      </Helmet>
      <h1 className="my-3">Sign Up</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control name="name" required />
        </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" required name="email" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" required name="password" />
          <Form.Group className="mb-3" controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control type="password" name="confirmPassword" required />
          </Form.Group>
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">Sign Up</Button>
        </div>
        <div className="mb-3">
          Already have an account?{" "}
          <Link to={`/signin?redirect=${redirect}`}>Sign-In</Link>
        </div>
      </Form>
    </Container>
  );
};

const mapStateToProps = (state) => {
  return {
    userData: state.userSlice.userData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loginHandler: (data) => dispatch(loginHandler({ data })),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
