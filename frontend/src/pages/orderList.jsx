import React, { useEffect } from "react";
import { connect } from "react-redux";
import {
  orderListHandler,
  deleteStart,
  deleteSucc,
  deleteFailed,
  reset,
} from "../stateManagment/reducer/fourthReducer";
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import MessageBox from "../components/massageBox/massageBox";
import LoadingBox from "../components/loadingBox/loadingBox";
import axios from "axios";
import { getError } from "../utils";
import Swal from "sweetalert2";

export const OrderList = (props) => {
  const navigate = useNavigate();

  const {
    isLoading,
    err,
    userData,
    orderListData,
    succesDelete,
    deletingLoading,
  } = props;

  useEffect(() => {
    if (succesDelete) {
      props.reset();
    } else {
      props.orderListHandler(userData.token);
    }
  }, [userData, succesDelete]);

  const deleteHandler = async (order) => {
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
            .delete(`/api/orders/${order._id}`, {
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
        <title>Orders</title>
      </Helmet>
      <h1>Orders</h1>
      {deletingLoading && <LoadingBox></LoadingBox>}
      {isLoading ? (
        <LoadingBox></LoadingBox>
      ) : err ? (
        <MessageBox variant="danger">{err}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orderListData.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user ? order.user.name : "DELETED USER"}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.totalPrice.toFixed(2)}</td>
                <td>{order.isPaid ? order.paidAt.substring(0, 10) : "No"}</td>
                <td>{order.isPaid ? order.paidAt.substring(0, 10) : "No"}</td>
                <td>
                  {order.isDelivered
                    ? order.deliveredAt.substring(0, 10)
                    : "No"}
                </td>
                <td>
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => {
                      navigate(`/order/${order._id}`);
                    }}
                  >
                    Details
                  </Button>
                  &nbsp;
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => deleteHandler(order)}
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
    isLoading: state.orderListSlice.isLoading,
    err: state.orderListSlice.err,
    orderListData: state.orderListSlice.orderListData,
    succesDelete: state.orderListSlice.succesDelete,
    deletingLoading: state.orderListSlice.deletingLoading,
    userData: state.userSlice.userData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    orderListHandler: (token) => orderListHandler(dispatch, token),
    deleteStart: () => dispatch(deleteStart()),
    deleteSucc: () => dispatch(deleteSucc()),
    deleteFailed: () => dispatch(deleteFailed()),
    reset: () => dispatch(reset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderList);
