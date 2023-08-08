import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { connect } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  getAllCartProducts,
  incressQuantity,
  minusQuantity,
  incressQuantityLocal,
  minusQuantityLocal,
  deleteAddedProduct,
  deleteAddedProductLocal,
} from "../stateManagment/reducer/reducer";

import { Button, Card, Col, ListGroup, Row } from "react-bootstrap";

export const Cart = (props) => {
  let addedItems = props.addedToLocal;

  const navigate = useNavigate();

  // useEffect(() => {
  //   let totalItems = [];

  //   props.addedToLocal.forEach((item) => {
  //     totalItems.push(item.name);
  //   });
  //   props.getCartProducts(totalItems.join("+"), props.addedToLocal);
  // }, []);

  return (
    <div>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h1>Shopping Cart</h1>
      <Row>
        <Col md={8}>
          {addedItems.length === 0 ? (
            <div>
              Cart is empty. <Link to="/">Go Shopping</Link>
            </div>
          ) : (
            <ListGroup>
              {addedItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row className="align-items-center">
                    <Col md={4}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="img-fluid rounded img-thumbnail"
                      ></img>{" "}
                      <Link to={`/product/${item.slug}`}>{item.name}</Link>
                    </Col>
                    <Col md={3}>
                      <Button
                        onClick={() => {
                          // props.minusQuantity(item.slug);
                          props.minusQuantityLocal(item.slug);
                        }}
                        variant="light"
                        disabled={item.quantity === 1}
                      >
                        <i className="fas fa-minus-circle"></i>
                      </Button>{" "}
                      <span>{item.quantity}</span>{" "}
                      <Button
                        variant="light"
                        onClick={() => {
                          // props.incressQuantity(item.slug);
                          props.incressQuantityLocal(item.slug);
                        }}
                        disabled={item.quantity === item.countInStock}
                      >
                        <i className="fas fa-plus-circle"></i>
                      </Button>
                    </Col>
                    <Col md={3}>${item.price}</Col>
                    <Col md={2}>
                      <Button
                        onClick={() => {
                          // props.deleteAddedProduct(item.slug);
                          props.deleteAddedProductLocal(item.slug);
                        }}
                        variant="light"
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>
                    Subtotal ({addedItems.reduce((a, c) => a + c.quantity, 0)}{" "}
                    items) : $
                    {addedItems.reduce((a, c) => a + c.price * c.quantity, 0)}
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => navigate("/signin?redirect=/shipping")}
                      disabled={addedItems.length === 0}
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
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
    addedToLocal: state.addToCartSlice.addedToLocal,
    // addedProducts: state.fetchCart.addedProducts,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // getAllCartProducts: (items, added) =>
    //   getAllCartProducts(dispatch, items, added),

    // incressQuantity: (name) => dispatch(incressQuantity({ name })),
    // minusQuantity: (name) => dispatch(minusQuantity({ name })),
    // deleteAddedProduct: (name) => dispatch(deleteAddedProduct({ name })),
    incressQuantityLocal: (name) => dispatch(incressQuantityLocal({ name })),
    minusQuantityLocal: (name) => dispatch(minusQuantityLocal({ name })),
    deleteAddedProductLocal: (name) =>
      dispatch(deleteAddedProductLocal({ name })),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
