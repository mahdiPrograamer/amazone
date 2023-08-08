import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  productList,
  postingData,
  deletingData,
  reset,
} from "../stateManagment/reducer/thirdReducer";
import { Button, Col, Row } from "react-bootstrap";
import LoadingBox from "../components/loadingBox/loadingBox";
import MessageBox from "../components/massageBox/massageBox";
import Swal from "sweetalert2";

export const ProductList = (props) => {
  const {
    products,
    countProducts,
    pages,
    loadingCreate,
    isLoading,
    userData,
    err,
    deletingLoading,
    successDelete,
  } = props;
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get("page") || 1;

  useEffect(() => {
    console.log(userData.token);
    props.productList(userData.token, page);
  }, [userData, page]);

  useEffect(() => {
    if (successDelete) {
      console.log(userData.token);
      props.productList(userData.token, page);
      props.reset();
    }
  }, [successDelete]);

  const createHandler = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, save it!",
    }).then((result) => {
      if (result.isConfirmed) {
        props.postingData(userData.token);
        Swal.fire("saved!", "Your product has been saved.", "success").then(
          (x) => {
            navigate(`/admin/product/${props.data.product._id}`);
          }
        );
      }
    });
  };

  const deleteHandler = async (product) => {
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
        props.deletingData(userData.token, product._id);
        Swal.fire("deleted!", "Your product has been deleted.", "success");
      }
    });
  };

  return (
    <div>
      <Row>
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="col text-end">
          <div>
            <Button type="button" onClick={createHandler}>
              Create Product
            </Button>
          </div>
        </Col>
      </Row>

      {loadingCreate && <LoadingBox></LoadingBox>}

      {isLoading ? (
        <LoadingBox></LoadingBox>
      ) : err ? (
        <MessageBox variant="danger">{err}</MessageBox>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => navigate(`/admin/product/${product._id}`)}
                    >
                      Edit
                    </Button>
                    &nbsp;
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => deleteHandler(product)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            {[...Array(pages).keys()].map((x) => (
              <Link
                className={x + 1 === Number(page) ? "btn text-bold" : "btn"}
                key={x + 1}
                to={`/admin/products?page=${x + 1}`}
              >
                {x + 1}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  console.log(state.productListSlice.postingData);
  return {
    products: state.productListSlice.products,
    err: state.productListSlice.err,
    countProducts: state.productListSlice.countProducts,
    page: state.productListSlice.page,
    pages: state.productListSlice.pages,
    loadingCreate: state.productListSlice.loadingCreate,
    deletingLoading: state.productListSlice.deletingLoading,
    successDelete: state.productListSlice.successDelete,
    isLoading: state.productListSlice.isLoading,
    data: state.productListSlice.postingData,
    userData: state.userSlice.userData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    productList: (token, page) => productList(dispatch, token, page),
    postingData: (token) => postingData(dispatch, token),
    deletingData: (token, id) => deletingData(dispatch, token, id),
    reset: () => dispatch(reset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductList);
