import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Button, Card, Col, ListGroup, Row } from "react-bootstrap";
import LoadingBox from "../components/loadingBox/loadingBox";
import MessageBox from "../components/massageBox/massageBox";
import {
  getOrder,
  fetchDeliverFailed,
  fetchDeliverStart,
  fetchDeliverSucc,
  reset,
} from "../stateManagment/reducer/loginReducer";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getError } from "../utils";
import axios from "axios";
import { toast } from "react-toastify";

export const Order = (props) => {
  const order = props.orderData;

  const params = useParams();
  const { id: orderId } = params;
  const navigate = useNavigate();

  useEffect(() => {
    props.getOrder(orderId, props.userData.token);

    if (!props.userData) {
      return navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (props.successDeliver) {
      props.getOrder(orderId, props.userData.token);
      props.reset();
    }
  }, [props.successDeliver]);

  async function deliverOrderHandler() {
    try {
      props.fetchStart();
      const { data } = await axios.put(
        `/api/orders/${order._id}/deliver`,
        {},
        {
          headers: { authorization: `Bearer ${props.userData.token}` },
        }
      );

      props.fetchSucc();
      toast.success("Order is delivered");
    } catch (err) {
      toast.error(getError(err));
      props.fetchFailed();
    }
  }

  return props.isLoading ? (
    <LoadingBox></LoadingBox>
  ) : props.err ? (
    <MessageBox variant="danger">{props.err}</MessageBox>
  ) : (
    <div>
      <Helmet>
        <title>Order {orderId}</title>
      </Helmet>
      <h1 className="my-3">Order {orderId}</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                {console.log(order)}
                <strong>Name:</strong> {order.shippingAddress.fullName} <br />
                <strong>Address: </strong> {order.shippingAddress.address},
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                ,{order.shippingAddress.country}
              </Card.Text>
              {order.isDelivered ? (
                <MessageBox variant="success">
                  Delivered at {order.deliveredAt}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Not Delivered</MessageBox>
              )}
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong>Method:</strong> {order.paymentMethod}
              </Card.Text>
              {order.isPaid ? (
                <MessageBox variant="success">
                  Paid at {order.paidAt}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Not Paid</MessageBox>
              )}
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {order.orderItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        ></img>{" "}
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </Col>
                      <Col md={3}>
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={3}>${item.price}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>${order.itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${order.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${order.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong> Order Total</strong>
                    </Col>
                    <Col>
                      <strong>${order.totalPrice.toFixed(2)}</strong>
                    </Col>
                  </Row>
                  {props.userData.isAdmin &&
                    order.isPaid &&
                    !order.isDelivered && (
                      <ListGroup.Item>
                        {/* {loadingDeliver && <LoadingBox></LoadingBox>} */}
                        <div className="d-grid">
                          <Button type="button" onClick={deliverOrderHandler}>
                            Deliver Order
                          </Button>
                        </div>
                      </ListGroup.Item>
                    )}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    orderData: state.orderSlice.data,
    isLoading: state.orderSlice.isLoading,
    err: state.orderSlice.err,
    successDeliver: state.orderSlice.successDeliver,
    userData: state.userSlice.userData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getOrder: (id, auth) => getOrder(dispatch, id, auth),
    fetchStart: () => dispatch(fetchDeliverStart()),
    fetchSucc: () => dispatch(fetchDeliverSucc()),
    fetchFailed: () => dispatch(fetchDeliverFailed()),
    reset: () => dispatch(reset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Order);
