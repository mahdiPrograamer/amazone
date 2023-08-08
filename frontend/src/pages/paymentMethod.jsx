import React, { useEffect } from "react";
import { connect } from "react-redux";
import { setPaymentMethod } from "../stateManagment/reducer/loginReducer";
import CheckingSteps from "../components/checkingSteps/checkingSteps";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";

export const PaymentMethod = (props) => {
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    navigate("/placeorder");
  };

  useEffect(() => {
    if (!props.shippingData.address) {
      navigate("/shipping");
    }
  }, [props.shippingData, navigate]);

  return (
    <div>
      <CheckingSteps step1 step2 step3></CheckingSteps>
      <div className="container small-container">
        <Helmet>
          <title>Payment Method</title>
        </Helmet>
        <h1 className="my-3">Payment Method</h1>
        <Form onSubmit={submitHandler}>
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="PayPal"
              label="PayPal"
              value="PayPal"
              checked={props.paymentMethod === "PayPal"}
              onChange={(e) => props.setPaymentMethod(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="Stripe"
              label="Stripe"
              value="Stripe"
              checked={props.paymentMethod === "Stripe"}
              onChange={(e) => props.setPaymentMethod(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <Button type="submit">Continue</Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    paymentMethod: state.userSlice.paymentMethod,
    shippingData: state.userSlice.shippingData,
  };
};

const mapDispatchToProps = (dispath) => {
  return {
    setPaymentMethod: (data) => dispath(setPaymentMethod({ data })),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentMethod);
