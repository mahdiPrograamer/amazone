import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getprofile } from "../stateManagment/reducer/loginReducer";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";

import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export const Profile = (props) => {
  const navigate = useNavigate();

  const submitHandler = (e) => {
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

    props.getprofile(props.userData.token, name, email, password);
    if (!props.err) {
      navigate("/");
    }
  };

  useEffect(() => {
    console.log(props.getprofile);
    if (props.err) {
      toast.error(props.err);
    }
  }, [props.err]);

  return (
    <div className="container small-container">
      <Helmet>
        <title>User Profile</title>
      </Helmet>
      <h1 className="my-3">User Profile</h1>
      <form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            defaultValue={props.userData.name}
            // onChange={(e) => setName(e.target.value)}
            name="name"
            required
          />
          {console.log("sss")}
        </Form.Group>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            defaultValue={props.userData.email}
            // onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            // onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            name="confirmPassword"
            // onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">Update</Button>
        </div>
      </form>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userData: state.userSlice.userData,
    err: state.profileSlice.err,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getprofile: (auth, name, email, password) =>
      getprofile(dispatch, auth, name, email, password),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
