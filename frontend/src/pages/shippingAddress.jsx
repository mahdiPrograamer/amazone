import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import CheckingSteps from "../components/checkingSteps/checkingSteps";
import { Helmet } from "react-helmet-async";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { shippingSetData } from "../stateManagment/reducer/loginReducer";

export const ShippingAddress = (props) => {
  const data = props.shippingData;
  const navigate = useNavigate();
  const formDataRef = useRef();

  const changeHandler = (e) => {
    e.preventDefault();

    const formData = new FormData(formDataRef.current);
    const fullName = formData.get("fullName");
    const address = formData.get("address");
    const city = formData.get("city");
    const postalCode = formData.get("postalCode");
    const country = formData.get("country");

    props.shippingSetData({ fullName, address, city, postalCode, country });
  };

  const submitHandler = (e) => {
    // e.preventDefault();

    // const formData = new FormData(e.target);
    // const fullName = formData.get("fullName");
    // const address = formData.get("address");
    // const city = formData.get("city");
    // const postalCode = formData.get("postalCode");
    // const country = formData.get("country");

    // props.shippingSetData({ fullName, address, city, postalCode, country });

    navigate("/payment");
  };
  useEffect(() => {
    if (!props.userData) {
      navigate("/signin?redirect=/shipping");
    } else {
      // const formData = new FormData(e.target);
      // const fullName = formData.get("fullName");
      // const address = formData.get("address");
      // const city = formData.get("city");
      // const postalCode = formData.get("postalCode");
      // const country = formData.get("country");
    }
  }, [props.userData, navigate]);
  return (
    <div>
      <Helmet>
        {console.log(props.shippingData)}
        <title>Shipping Address</title>
      </Helmet>

      <CheckingSteps step1 step2></CheckingSteps>
      <div className="container small-container">
        <h1 className="my-3">Shipping Address</h1>
        <Form
          onSubmit={submitHandler}
          onChange={changeHandler}
          ref={formDataRef}
        >
          <Form.Group className="mb-3" controlId="fullName">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              defaultValue={data.fullName || ""}
              name="fullName"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control
              defaultValue={data.address || ""}
              name="address"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="city">
            <Form.Label>City</Form.Label>
            <Form.Control defaultValue={data.city || ""} name="city" required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="postalCode">
            <Form.Label>Postal Code</Form.Label>
            <Form.Control
              defaultValue={data.postalCode || ""}
              name="postalCode"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="country">
            <Form.Label>Country</Form.Label>
            <Form.Control
              defaultValue={data.country || ""}
              name="country"
              required
            />
          </Form.Group>
          <div className="mb-3">
            <Button
              id="chooseOnMap"
              type="button"
              variant="light"
              onClick={() => navigate("/map")}
            >
              Choose Location On Map
            </Button>
            {props.position && props.position.lat ? (
              <div>
                LAT: {props.position.lat}
                LNG:{props.position.lng}
              </div>
            ) : (
              <div>No location</div>
            )}
          </div>

          <div className="mb-3">
            <Button variant="primary" type="submit">
              Continue
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userData: state.userSlice.userData,
    shippingData: state.userSlice.shippingData,
    position: state.userSlice.position,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    shippingSetData: (data) => dispatch(shippingSetData({ data })),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ShippingAddress);
