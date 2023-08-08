import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { connect } from "react-redux";
import LoadingBox from "../components/loadingBox/loadingBox";
import MessageBox from "../components/massageBox/massageBox";
import { Button } from "react-bootstrap";
import { getOneOrder } from "../stateManagment/reducer/loginReducer";
import { useNavigate } from "react-router-dom";

export const History = (props) => {
  const navigate = useNavigate();

  useEffect(() => {
    props.getOneOrder(props.userData.token);
  }, [props.userData]);

  return (
    <div>
      <Helmet>
        <title>Order History</title>
      </Helmet>

      <h1>Order History</h1>
      {props.isLoading ? (
        <LoadingBox></LoadingBox>
      ) : props.err ? (
        <MessageBox variant="danger">{props.err}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {props.orderData.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.totalPrice.toFixed(2)}</td>
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
    orderData: state.OneOrderSlice.data,
    isLoading: state.OneOrderSlice.isLoading,
    err: state.OneOrderSlice.err,
    userData: state.userSlice.userData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getOneOrder: (auth) => getOneOrder(dispatch, auth),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(History);
