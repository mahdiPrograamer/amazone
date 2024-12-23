import React from "react";
import { connect } from "react-redux";
import {
  fetchStart,
  fetchSucc,
  fetchfailed,
} from "../stateManagment/reducer/loginReducer";
import Axios from "axios";
import CheckoutSteps from "../components/checkingSteps/checkingSteps";
import { Helmet } from "react-helmet-async";
import { Button, Card, Col, ListGroup, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { getError } from "../utils";
import { toast } from "react-toastify";

export const PlaceOrder = (props) => {
  const navigate = useNavigate();

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.2345 => 123.23

  const itemsPrice = round2(
    props.addedToLocal.reduce((a, c) => a + c.quantity * c.price, 0)
  );

  const shippingPrice = itemsPrice > 100 ? round2(0) : round2(10);
  const taxPrice = round2(0.15 * itemsPrice);
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  console.log({
    orderItems: props.addedToLocal,
    shippingAddress: props.shippingData,
    paymentMethod: props.paymentMethod,
    position: props.position,
    itemsPrice: itemsPrice,
    shippingPrice: shippingPrice,
    taxPrice: taxPrice,
    totalPrice: totalPrice,
  });
  const placeOrderHandler = async () => {
    try {
      props.fetchStart();

      const { data } = await Axios.post(
        "/api/orders",
        {
          orderItems: props.addedToLocal,
          shippingAddress: props.shippingData,
          paymentMethod: props.paymentMethod,
          position: props.position,
          itemsPrice: itemsPrice,
          shippingPrice: shippingPrice,
          taxPrice: taxPrice,
          totalPrice: totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${props.userData.token}`,
          },
        }
      );
      props.fetchSucc();
      navigate(`/order/${data.order._id}`);
    } catch (err) {
      props.fetchfailed();
      toast.error(getError(err));
    }
  };

  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
      <Helmet>
        <title>Preview Order</title>
      </Helmet>
      <h1 className="my-3">Preview Order</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <strong>Name:</strong> {props.shippingData.fullName} <br />
                <strong>Address: </strong> {props.shippingData.address},
                {props.shippingData.city}, {props.shippingData.postalCode},
                {props.shippingData.country}
              </Card.Text>
              <Link to="/shipping">Edit</Link>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong>Method:</strong> {props.paymentMethod}
              </Card.Text>
              <Link to="/payment">Edit</Link>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {props.addedToLocal.map((item) => (
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
              <Link to="/cart">Edit</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>${itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong> Order Total</strong>
                    </Col>
                    <Col>
                      <strong>${totalPrice.toFixed(2)}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      onClick={placeOrderHandler}
                      disabled={props.addedToLocal.length === 0}
                    >
                      Place Order
                    </Button>
                  </div>
                  {/* {loading && <LoadingBox></LoadingBox>} */}
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
    paymentMethod: state.userSlice.paymentMethod,
    shippingData: state.userSlice.shippingData,
    userData: state.userSlice.userData,
    addedToLocal: state.addToCartSlice.addedToLocal,
    position: state.userSlice.position,
  };
};

const mapDispatchToProps = (dispath) => {
  return {
    fetchStart: () => dispath(fetchStart()),
    fetchSucc: () => dispath(fetchSucc()),
    fetchfailed: () => dispath(fetchfailed()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PlaceOrder);
