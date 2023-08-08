import axios from "axios";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import {
  fetchStart,
  fetchSucc,
  fetchFailed,
  deleteUserStart,
  deleteUserSucc,
  deleteUserFailed,
  resetUser,
} from "../stateManagment/reducer/fourthReducer";
import { getError } from "../utils";
import LoadingBox from "../components/loadingBox/loadingBox";
import MessageBox from "../components/massageBox/massageBox";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const UserList = (props) => {
  const { isLoading, err, userData, userListData } = props;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        props.fetchStart();
        const { data } = await axios.get(`/api/users`, {
          headers: { Authorization: `Bearer ${userData.token}` },
        });
        props.fetchSucc(data);
      } catch (err) {
        props.fetchFailed(err);
      }
    };
    fetchData();
  }, [userData]);

  const deleteHandler = async (user) => {
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
          props.deleteStart();
          axios
            .delete(`/api/users/${user._id}`, {
              headers: { Authorization: `Bearer ${userData.token}` },
            })
            .then((x) => {
              props.deleteSucc();
              Swal.fire(
                "deleted!",
                "Your product has been deleted.",
                "success"
              );
            });
        } catch (err) {
          toast.error(getError(err));
          props.deleteFailed();
        }
      }
    });
  };

  return (
    <div>
      <Helmet>
        <title>Users</title>
      </Helmet>
      <h1>Users</h1>
      {isLoading ? (
        <LoadingBox></LoadingBox>
      ) : err ? (
        <MessageBox variant="danger">{err}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>IS ADMIN</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {userListData.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.isAdmin ? "YES" : "NO"}</td>
                <td>
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => navigate(`/admin/user/${user._id}`)}
                  >
                    Edit
                  </Button>
                  &nbsp;
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => deleteHandler(user)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isLoading: state.userListSlice.isLoading,
    err: state.userListSlice.err,
    userListData: state.userListSlice.userListData,
    userData: state.userSlice.userData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchStart: () => dispatch(fetchStart()),
    fetchSucc: (data) => dispatch(fetchSucc({ data })),
    fetchFailed: (err) => dispatch(fetchFailed(err)),
    deleteStart: () => dispatch(deleteUserStart()),
    deleteSucc: () => dispatch(deleteUserSucc()),
    deleteFailed: () => dispatch(deleteUserFailed()),
    reset: () => dispatch(resetUser()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserList);
