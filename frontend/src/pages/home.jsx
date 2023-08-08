import React, { useEffect } from "react";
import { connect } from "react-redux";
import ProductCard from "../components/card/productCard";
import { getAllProducts } from "../stateManagment/reducer/reducer";
import { Col, Row } from "react-bootstrap";

export const Home = (props) => {
  useEffect(() => {
    props.getAll();
  }, []);

  return (
    <>
      {props.isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="home-wraper">
          <h1>products for selling</h1>
          <Row>
            {props.productsData.map((product) => (
              <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
                <ProductCard data={product}></ProductCard>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    productsData: state.productsSlice.slugs,
    isLoading: state.productsSlice.isLoading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAll: () => getAllProducts(dispatch),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Home);
