import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data));
  }, [id]);

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    alert('Product added to cart!');
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="product-detail">
      <img src={product.image} alt={product.title} width="200" />
      <h2>{product.title}</h2>
      <p>{product.description}</p>
      <h3>₹ {product.price}</h3>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
}

export default ProductDetail;
