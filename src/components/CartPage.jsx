import React from 'react';
import { useSelector } from 'react-redux';

function CartPage() {
  const cart = useSelector((state) => state.cart.items);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Your Cart 🛒</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cart.map((item, index) => (
            <li key={index} style={{ marginBottom: '10px' }}>
              <img src={item.image} alt={item.title} width="80" />
              <div>
                <strong>{item.title}</strong>
                <p>₹{item.price}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CartPage;
