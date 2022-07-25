import React, { useContext, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import axios from 'axios';
import { Store } from '../Store';

function Product(props) {
  const { product } = props;

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const [dis, setDis] = useState(false);
  const addToCartHandler = async (item) => {
    console.log('i am working')
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countinstock < quantity) {
      window.alert('Sorry, This item is not in stock');
      setDis(true);
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  }
  return (
    <Card className="product">
      <div className="makasam">
        <Link to={`/product/${product.slug}`}>
          <img
            src={product.image}
            className="card-img-top"
            alt={product.image}
          ></img>
        </Link>
      </div>
      <Card.Body className="product-info">
        <Link id="to" to={`/product/${product.slug}`}>
          <Card.Title id="ad">{product.name}</Card.Title>
        </Link>

        <Rating
          rating={product.rating}
          numReviews={product.numReviews}
        ></Rating>

        <Card.Text id="pro">{product.price} Rs.</Card.Text>

        {/* {product.countinstock === 0 ? (<Button variant='light' disabled>Out Of Stock</Button>
        ) :
          (<Button
            onClick={() => addToCartHandler(product)}
            className="cart">Add To Cart</Button>)} */}
        <Button disabled={dis}
          onClick={() => addToCartHandler(product)}
          className="cart">{
            dis ? "Out Of Stock" : "Add To Cart"
          }</Button>

      </Card.Body>
    </Card>
  );
}

export default Product;
