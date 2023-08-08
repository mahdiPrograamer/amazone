import React, { useEffect } from "react";
import { connect } from "react-redux";
import { loginHandler } from "../stateManagment/reducer/loginReducer";
import { getError } from "../utils";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { Button, Container, Form } from "react-bootstrap";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export const Login = (props) => {
  const userInfo = props.userData;

  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const { data } = await axios.post("/api/users/signin", {
        email,
        password,
      });

      props.loginHandler(data);
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <Container className="small-container">
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <h1 className="my-3">Sign In</h1>
      <Form onSubmit={(e) => submitHandler(e)}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" required name="email" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" required name="password" />
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">Sign In</Button>
        </div>
        <div className="mb-3">
          New customer?{" "}
          <Link to={`/signup?redirect=${redirect}`}>Create your account</Link>
        </div>
      </Form>
    </Container>
  );
};

const mapStateToProps = (state) => {
  return {
    products: state.productsSlice.slugs,
    userData: state.userSlice.userData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loginHandler: (data) => dispatch(loginHandler({ data })),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
