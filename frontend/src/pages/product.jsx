import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { connect } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  getAllProducts,
  getProduct,
  addToLocalCart,
  getOneProducts,
  createRequest,
  createSucc,
  resetSlug,
  createFailed,
} from "../stateManagment/reducer/reducer";
import {
  Col,
  ListGroup,
  Row,
  Card,
  Badge,
  Button,
  Form,
  FloatingLabel,
} from "react-bootstrap";
import Rating from "../components/raiting/raiting";
import MessageBox from "../components/massageBox/massageBox";
import LoadingBox from "../components/loadingBox/loadingBox";
import P404 from "../components/404/404";
import axios from "axios";
import { toast } from "react-toastify";
import { getError } from "../utils";

export const Product = (props) => {
  let reviewsRef = useRef();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedImage, setSelectedImage] = useState("");

  const params = useParams();
  const { product } = params;

  useEffect(() => {
    console.log(props.currentProductsData);
    props.getOneProducts(product);
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!comment || !rating) {
      toast.error("Please enter comment and rating");
      return;
    }
    try {
      props.createRequest();
      const { data } = await axios.post(
        `/api/products/${props.currentProductsData._id}/reviews`,
        { rating, comment, name: props.userData.name },
        {
          headers: { Authorization: `Bearer ${props.userData.token}` },
        }
      );

      props.createSucc();
      toast.success("Review submitted successfully");

      let newData = {
        ...props.currentProductsData,
        numReviews: data.numReviews,
        rating: data.rating,
        reviews: [...props.currentProductsData.reviews, data.review],
      };
      props.resetSlug(newData);

      setRating(0);
      setComment("");

      window.scrollTo({
        behavior: "smooth",
        top: reviewsRef.current.offsetTop,
      });
    } catch (err) {
      toast.error(getError(err));
      props.createFailed(err);
    }
  };

  return (
    <>
      {props.isLoading && <div>Loading...</div>}
      <>
        {true && (
          <>
            {props.isShow404 ? (
              <P404 massage={props.isShow404} />
            ) : (
              <div>
                <Row>
                  <Col md={6}>
                    <img
                      className="img-large"
                      src={props.currentProductsData.image}
                      alt={props.currentProductsData.name}
                    ></img>
                  </Col>
                  <Col md={3}>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <Helmet>
                          <title>{props.currentProductsData.name}</title>
                        </Helmet>

                        <h1>{props.currentProductsData.name}</h1>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <Rating
                          rating={props.currentProductsData.rating}
                          numReviews={props.currentProductsData.numReviews}
                        ></Rating>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        Pirce : ${props.currentProductsData.price}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        Description:
                        <p>{props.currentProductsData.description}</p>
                      </ListGroup.Item>
                    </ListGroup>
                  </Col>
                  <Col md={3}>
                    <Card>
                      <Card.Body>
                        <ListGroup variant="flush">
                          <ListGroup.Item>
                            <Row>
                              <Col>Price:</Col>
                              <Col>${props.currentProductsData.price}</Col>
                            </Row>
                          </ListGroup.Item>
                          <ListGroup.Item>
                            <Row>
                              <Col>Status:</Col>
                              <Col>
                                {props.currentProductsData.countInStock > 0 ? (
                                  <Badge bg="success">In Stock</Badge>
                                ) : (
                                  <Badge bg="danger">Unavailable</Badge>
                                )}
                              </Col>
                            </Row>
                          </ListGroup.Item>

                          {props.currentProductsData.countInStock > 0 && (
                            <ListGroup.Item>
                              <div className="d-grid">
                                <Button
                                  variant="primary"
                                  onClick={() =>
                                    props.addToLocalCart({
                                      item: props.currentProductsData,
                                    })
                                  }
                                >
                                  Add to Cart
                                </Button>
                              </div>
                            </ListGroup.Item>
                          )}
                        </ListGroup>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
                //hello
                <div className="my-3">
                  <h2 ref={reviewsRef}>Reviews</h2>
                  {!props.currentProductsData.reviews ||
                  props.currentProductsData.reviews.length === 0 ? (
                    <div className="mb-3">
                      <MessageBox>There is no review</MessageBox>
                    </div>
                  ) : (
                    <ListGroup>
                      {props.currentProductsData.reviews.map((review) => (
                        <ListGroup.Item key={review._id}>
                          <strong>{review.name}</strong>
                          <Rating rating={review.rating} caption=" "></Rating>
                          <p>{review.createdAt.substring(0, 10)}</p>
                          <p>{review.comment}</p>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                  <div className="my-3">
                    {props.userData ? (
                      <form onSubmit={submitHandler}>
                        <h2>Write a customer review</h2>
                        <Form.Group className="mb-3" controlId="rating">
                          <Form.Label>Rating</Form.Label>
                          <Form.Select
                            aria-label="Rating"
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                          >
                            <option value="">Select...</option>
                            <option value="1">1- Poor</option>
                            <option value="2">2- Fair</option>
                            <option value="3">3- Good</option>
                            <option value="4">4- Very good</option>
                            <option value="5">5- Excelent</option>
                          </Form.Select>
                        </Form.Group>
                        <FloatingLabel
                          controlId="floatingTextarea"
                          label="Comments"
                          className="mb-3"
                        >
                          <Form.Control
                            as="textarea"
                            placeholder="Leave a comment here"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                          />
                        </FloatingLabel>

                        <div className="mb-3">
                          <Button disabled={props.createLoading} type="submit">
                            Submit
                          </Button>
                          {props.createLoading && <LoadingBox></LoadingBox>}
                        </div>
                      </form>
                    ) : (
                      <MessageBox>
                        Please{" "}
                        <Link
                          to={`/signin?redirect=/product/${props.currentProductsData.slug}`}
                        >
                          Sign In
                        </Link>{" "}
                        to write a review
                      </MessageBox>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    products: state.productsSlice.slugs, // i dont know
    currentProductsData: state.OneproductsSlice.slug,
    err: state.OneproductsSlice.err,
    userData: state.userSlice.userData,
    isLoading: state.OneproductsSlice.isLoading,
    addToCart: state.productsSlice.addToCart,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addCurrenProduct: (productName) => dispatch(getProduct(productName)),
    getOneProducts: (data) => getOneProducts(dispatch, data),
    addToLocalCart: (name) => dispatch(addToLocalCart(name)),

    createRequest: () => dispatch(createRequest()),
    createSucc: () => createSucc(),
    resetSlug: (data) => dispatch(resetSlug({ data })),
    createFailed: (err) => dispatch(createFailed(err)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Product);
