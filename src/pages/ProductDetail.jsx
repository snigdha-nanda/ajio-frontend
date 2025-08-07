import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { addToCart } from '../features/cart/cartSlice';
import { useDispatch } from 'react-redux';
import { auth } from '../firebase';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import { FaHeart, FaRegHeart, FaStar, FaStarHalfAlt, FaRegStar, FaTruck, FaUndo, FaShieldAlt } from 'react-icons/fa';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Black');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [pincode, setPincode] = useState('');
  const [showDeliveryInfo, setShowDeliveryInfo] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  const productExtras = {
    rating: 4.3,
    reviewCount: 1247,
    originalPrice: 2999,
    discount: 40,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Black', code: '#000000' },
      { name: 'Navy', code: '#1e3a8a' },
      { name: 'Maroon', code: '#4B0F2B' },
      { name: 'White', code: '#ffffff' }
    ],
    details: {
      brand: 'AJIO Premium',
      material: '100% Cotton',
      fit: 'Regular Fit',
      pattern: 'Solid'
    },
    offers: [
      'Flat 40% OFF on orders above ₹1999',
      'Buy 2 Get 1 Free on selected items'
    ],
    reviews: [
      { id: 1, name: 'Rahul S.', rating: 5, comment: 'Excellent quality! Perfect fit.', verified: true },
      { id: 2, name: 'Priya M.', rating: 4, comment: 'Good product, nice quality.', verified: true }
    ]
  };

  useEffect(() => {
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const getDiscountedPrice = () => {
    return Math.round(productExtras.originalPrice * (1 - productExtras.discount / 100));
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} color="#D4AF37" />);
      } else if (i - 0.5 <= rating) {
        stars.push(<FaStarHalfAlt key={i} color="#D4AF37" />);
      } else {
        stars.push(<FaRegStar key={i} color="#D4AF37" />);
      }
    }
    return stars;
  };

  const handleAddToCart = () => {
    if (!auth.currentUser) {
      toast.warning('Please log in to add to cart');
      navigate('/login');
      return;
    }
    
    dispatch(addToCart({
      id: product.id,
      title: product.title,
      price: getDiscountedPrice(),
      image: product.image,
      quantity: quantity,
      size: selectedSize,
      color: selectedColor,
    }));
    toast.success('Added to cart');
  };

  const handleWishlist = () => {
    if (!auth.currentUser) {
      toast.warning('Please log in');
      navigate('/login');
      return;
    }
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const checkDelivery = () => {
    if (pincode.length === 6) {
      setShowDeliveryInfo(true);
      toast.success('Delivery available!');
    } else {
      toast.error('Enter valid pincode');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container text-center" style={{ padding: '2rem' }}>
          Loading product...
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="container text-center" style={{ padding: '2rem' }}>
          Product not found
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container" style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          
          <div>
            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <img
                src={product.image}
                alt={product.title}
                style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' }}
              />
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.9rem', color: 'var(--color-accent)', fontWeight: '600', marginBottom: '0.5rem' }}>
              {productExtras.details.brand}
            </div>
            
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-primary)', margin: '0 0 1rem 0' }}>
              {product.title}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {renderStars(productExtras.rating)}
              </div>
              <span style={{ fontWeight: '600' }}>{productExtras.rating}</span>
              <span style={{ color: '#5f4d6a' }}>({productExtras.reviewCount} reviews)</span>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--color-primary)' }}>
                  ₹{getDiscountedPrice()}
                </span>
                <span style={{ fontSize: '1.2rem', textDecoration: 'line-through', color: '#5f4d6a' }}>
                  ₹{productExtras.originalPrice}
                </span>
                <span className="badge-cart">
                  {productExtras.discount}% OFF
                </span>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Color: {selectedColor}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {productExtras.colors.map((color) => (
                  <div
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: color.code,
                      border: selectedColor === color.name ? '3px solid var(--color-primary)' : '2px solid var(--color-border)',
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Size: {selectedSize}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {productExtras.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={selectedSize === size ? 'btn-primary-custom' : 'btn-outline'}
                    style={{ padding: '0.5rem 1rem' }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Quantity:
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="btn-outline"
                  style={{ 
                    width: '40px', 
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    fontWeight: '600'
                  }}
                >
                  -
                </button>
                <span style={{ 
                  padding: '0.5rem 1rem', 
                  border: '1px solid var(--color-border)', 
                  borderRadius: '6px',
                  minWidth: '60px',
                  textAlign: 'center',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '40px'
                }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="btn-outline"
                  style={{ 
                    width: '40px', 
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    fontWeight: '600'
                  }}
                >
                  +
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <button onClick={handleAddToCart} className="btn-primary-custom" style={{ flex: '1' }}>
                ADD TO BAG
              </button>
              <button onClick={handleWishlist} className="btn-outline" style={{ padding: '0.75rem' }}>
                {isWishlisted ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
              </button>
            </div>

            <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                🎉 Special Offers
              </div>
              {productExtras.offers.map((offer, index) => (
                <div key={index} style={{ fontSize: '0.9rem', color: '#5f4d6a', marginBottom: '0.25rem' }}>
                  • {offer}
                </div>
              ))}
            </div>

            <div className="card" style={{ padding: '1rem' }}>
              <div style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                🚚 Delivery Options
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <input
                  type="text"
                  placeholder="Enter Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="form-control"
                  style={{ flex: '1' }}
                />
                <button onClick={checkDelivery} className="btn-primary-custom">
                  CHECK
                </button>
              </div>
              
              {showDeliveryInfo && (
                <div style={{ fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <FaTruck color="#16a34a" />
                    <span>Delivery by Jan 25, 2024 (2-3 days)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <FaUndo color="#2563eb" />
                    <span>15 days return window</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaShieldAlt color="#7c3aed" />
                    <span>Cash on Delivery Available</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', borderBottom: '2px solid var(--color-border)', marginBottom: '1.5rem' }}>
            <button
              onClick={() => setActiveTab('details')}
              style={{
                padding: '1rem 2rem',
                border: 'none',
                background: 'transparent',
                fontSize: '1rem',
                fontWeight: '600',
                color: activeTab === 'details' ? 'var(--color-primary)' : '#5f4d6a',
                borderBottom: activeTab === 'details' ? '3px solid var(--color-primary)' : '3px solid transparent',
                cursor: 'pointer'
              }}
            >
              Product Details
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              style={{
                padding: '1rem 2rem',
                border: 'none',
                background: 'transparent',
                fontSize: '1rem',
                fontWeight: '600',
                color: activeTab === 'reviews' ? 'var(--color-primary)' : '#5f4d6a',
                borderBottom: activeTab === 'reviews' ? '3px solid var(--color-primary)' : '3px solid transparent',
                cursor: 'pointer'
              }}
            >
              Customer Reviews
            </button>
          </div>

          {activeTab === 'details' && (
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--color-primary)', marginBottom: '1rem' }}>
                Product Details
              </h3>
              <p style={{ color: '#5f4d6a', lineHeight: '1.6', marginBottom: '1rem' }}>
                {product.description}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {Object.entries(productExtras.details).map(([key, value]) => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                    <span style={{ fontWeight: '600', textTransform: 'capitalize' }}>{key}:</span>
                    <span style={{ color: '#5f4d6a' }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--color-primary)', margin: 0 }}>
                  Customer Reviews ({productExtras.reviewCount})
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {renderStars(productExtras.rating)}
                  </div>
                  <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>
                    {productExtras.rating}/5
                  </span>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {productExtras.reviews.map((review) => (
                  <div key={review.id} className="card" style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: '600' }}>{review.name}</span>
                        {review.verified && (
                          <span style={{ 
                            background: '#16a34a',
                            color: 'white',
                            padding: '0.125rem 0.375rem',
                            borderRadius: '4px',
                            fontSize: '0.7rem'
                          }}>
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '2px', marginBottom: '0.5rem' }}>
                      {renderStars(review.rating)}
                    </div>
                    <p style={{ color: '#5f4d6a', margin: 0 }}>
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
