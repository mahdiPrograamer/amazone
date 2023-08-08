import { Link } from "react-router-dom";
import "./productCard.css";
import { Card, Button } from "react-bootstrap";
import { getProduct } from "../../stateManagment/reducer/reducer";
import Rating from "../raiting/raiting";
import { connect } from "react-redux";
import { addToLocalCart } from "../../stateManagment/reducer/reducer";

export const ProductCard = (props) => {
  const { data } = props;
  return (
    <Card>
      <Link to={`/product/${data.slug}`}>
        <img src={data.image} className="card-img-top" alt={data.name} />
      </Link>
      <Card.Body>
        <Link to={`/product/${data.slug}`}>
          <Card.Title>{data.name}</Card.Title>
        </Link>
        <Rating rating={data.rating} numReviews={data.numReviews} />
        <Card.Text className="mt-3">${data.price}</Card.Text>
        <Button
          className="btn-primary mt-3"
          onClick={() =>
            props.addToLocalCart({
              item: data,
            })
          }
        >
          Add to cart
        </Button>
      </Card.Body>
    </Card>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    addCurrenProduct: () => dispatch(getProduct()),
    addToLocalCart: (name) => dispatch(addToLocalCart(name)),
  };
};

export default connect(null, mapDispatchToProps)(ProductCard);
