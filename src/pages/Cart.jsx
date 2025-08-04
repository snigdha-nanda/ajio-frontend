// src/pages/Cart.js
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart } from "../redux/cartSlice";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const totalPrice = cart.reduce((total, item) => total + item.price, 0).toFixed(2);

  const handleRemove = (index) => {
    dispatch(removeFromCart(index));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🛒 Your Shopping Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item, index) => (
            <div
              key={index}
              style={{
                borderBottom: "1px solid #ccc",
                marginBottom: "10px",
                paddingBottom: "10px",
              }}
            >
              <h4>{item.title}</h4>
              <p>₹{item.price}</p>
              <img src={item.image} alt={item.title} width="100" />
              <br />
              <button onClick={() => handleRemove(index)}>❌ Remove</button>
            </div>
          ))}
          <h3>Total: ₹{totalPrice}</h3>
          <button onClick={() => alert("Proceeding to checkout...")}>✅ Checkout</button>
        </>
      )}
      <br />
      <button onClick={() => navigate("/")}>🔙 Continue Shopping</button>
    </div>
  );
};

export default Cart;
