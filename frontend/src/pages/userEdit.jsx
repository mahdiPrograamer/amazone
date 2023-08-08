import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getUserDataStart,
  getUserDataSucc,
  getUserDataFailed,
  updateStart,
  updateSucc,
  updateFailed,
} from "../stateManagment/reducer/fourthReducer";
import { getError } from "../utils";
import axios from "axios";
import Swal from "sweetalert2";
import { Button, Container, Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/loadingBox/loadingBox";
import MessageBox from "../components/massageBox/massageBox";
import { toast } from "react-toastify";

export const UserEdit = (props) => {
  const { userData, isLoading, err, updateLoading } = props;

  const params = useParams();
  const { id: userId } = params;
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        props.getUserDataStart();
        const { data } = await axios.get(`/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${userData.token}` },
        });
        setName(data.name);
        setEmail(data.email);
        setIsAdmin(data.isAdmin);
        props.getUserDataSucc();
      } catch (err) {
        props.getUserDataFailed(err);
      }
    };
    fetchData();
  }, [userId, userData]);

  const submitHandler = async (e) => {
    e.preventDefault();

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delte it!",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          props.updateStart();
          axios
            .put(
              `/api/users/${userId}`,
              { _id: userId, name, email, isAdmin },
              {
                headers: { Authorization: `Bearer ${userData.token}` },
              }
            )
            .then((x) => {
              props.updateSucc();
              Swal.fire(
                "deleted!",
                "Your product has been deleted.",
                "success"
              );
            });
        } catch (err) {
          toast.error(getError(err));
          props.updateFailed();
        }
      }
    });
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>Edit User ${userId}</title>
      </Helmet>
      <h1>Edit User {userId}</h1>

      {isLoading ? (
        <LoadingBox></LoadingBox>
      ) : err ? (
        <MessageBox variant="danger">{err}</MessageBox>
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              value={email}
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Check
            className="mb-3"
            type="checkbox"
            id="isAdmin"
            label="isAdmin"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
          />

          <div className="mb-3">
            <Button disabled={updateLoading} type="submit">
              Update
            </Button>
            {updateLoading && <LoadingBox></LoadingBox>}
          </div>
        </Form>
      )}
    </Container>
  );
};

const mapStateToProps = (state) => {
  return {
    isLoading: state.userListSlice.getDataLoading,
    err: state.userListSlice.getUserDataErr,
    updateLoading: state.userListSlice.updateLoading,
    userData: state.userSlice.userData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUserDataStart: () => dispatch(getUserDataStart()),
    getUserDataSucc: () => dispatch(getUserDataSucc()),
    getUserDataFailed: (err) => dispatch(getUserDataFailed(err)),
    updateStart: () => dispatch(updateStart()),
    updateSucc: () => dispatch(updateSucc()),
    updateFailed: () => dispatch(updateFailed()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserEdit);
