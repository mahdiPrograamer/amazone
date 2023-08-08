import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchUpdateStart,
  fetchUpdateFailed,
  fetchUpdateSucc,
  requestStart,
  requestSucc,
  requestFailed,
} from "../stateManagment/reducer/fourthReducer";
import { getError } from "../utils";
import { toast } from "react-toastify";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { Button, Container, Form } from "react-bootstrap";
import LoadingBox from "../components/loadingBox/loadingBox";
import MessageBox from "../components/massageBox/massageBox";

export const ProductEdit = (props) => {
  const navigate = useNavigate();
  const params = useParams(); // /product/:id
  const { id: productId } = params;

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        props.fetchUpdateStart();
        const { data } = await axios.get(`/api/products/${productId}`);
        setName(data.name);
        setSlug(data.slug);
        setPrice(data.price);
        setImage(data.image);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setBrand(data.brand);
        setDescription(data.description);
        props.fetchUpdateSucc();
      } catch (err) {
        props.fetchUpdateFailed(getError(err));
      }
    };
    fetchData();
  }, [productId]);
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      props.requestStart();
      await axios.put(
        `/api/products/${productId}`,
        {
          _id: productId,
          name,
          slug,
          price,
          image,
          category,
          brand,
          countInStock,
          description,
        },
        {
          headers: { Authorization: `Bearer ${props.userData.token}` },
        }
      );
      props.requestSucc();
      toast.success("Product updated successfully");
      navigate("/admin/products");
    } catch (err) {
      toast.error(getError(err));
      props.requestFailed(getError(err));
    }
  };
  const uploadFileHandler = async (e) => {
    console.log(e.target.files);
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    try {
      const { data } = await axios.post("/api/upload", bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${props.userData.token}`,
        },
      });

      toast.success("Image uploaded successfully");
      setImage(data.secure_url);
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>Edit Product ${productId}</title>
      </Helmet>
      <h1>Edit Product {productId}</h1>

      {props.isLoading ? (
        <LoadingBox></LoadingBox>
      ) : props.err ? (
        <MessageBox variant="danger">{props.err}</MessageBox>
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="slug">
            <Form.Label>Slug</Form.Label>
            <Form.Control
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Price</Form.Label>
            <Form.Control
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="image">
            <Form.Label>Image File</Form.Label>
            <Form.Control
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="imageFile">
            <Form.Label>Upload File</Form.Label>
            <Form.Control type="file" onChange={uploadFileHandler} />
            {/* {loadingUpload && <LoadingBox></LoadingBox>} */}
          </Form.Group>

          <Form.Group className="mb-3" controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="brand">
            <Form.Label>Brand</Form.Label>
            <Form.Control
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="countInStock">
            <Form.Label>Count In Stock</Form.Label>
            <Form.Control
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>
          <div className="mb-3">
            <Button disabled={props.updateLoading} type="submit">
              Update
            </Button>
            {props.updateLoading && <LoadingBox></LoadingBox>}
          </div>
        </Form>
      )}
    </Container>
  );
};

const mapStateToProps = (state) => {
  return {
    isLoading: state.updateProductSlice.isLoading,
    err: state.updateProductSlice.err,
    updateLoading: state.updateProductSlice.updateLoading,
    userData: state.userSlice.userData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUpdateStart: () => dispatch(fetchUpdateStart()),
    fetchUpdateSucc: () => dispatch(fetchUpdateSucc()),
    fetchUpdateFailed: (err) => dispatch(fetchUpdateFailed(err)),
    requestStart: () => dispatch(requestStart()),
    requestSucc: () => dispatch(requestSucc()),
    requestFailed: (err) => dispatch(requestFailed(err)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductEdit);
