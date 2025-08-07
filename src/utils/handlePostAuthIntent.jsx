// src/utils/handlePostAuthIntent.js
import { addToCart } from '../features/cart/cartSlice';
import { toast } from 'react-toastify';

export const handlePostAuthIntent = ({ intended, dispatch, navigate, from }) => {
  if (intended?.action === 'add-to-cart' && intended.product) {
    dispatch(
      addToCart({
        id: intended.product.id,
        title: intended.product.title,
        price: intended.product.price,
        image: intended.product.image,
        quantity: 1,
      })
    );
    toast.success('Added to cart');
    navigate(from || '/');
  } else {
    navigate(from || '/');
  }
};
