import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import { FaHeart, FaRegHeart, FaStar, FaStarHalfAlt, FaRegStar, FaTruck, FaUndo, FaShieldAlt } from 'react-icons/fa';
import { fetchProductById } from '../api/backendApi';
import { addToCart } from '../utils/cartService';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
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
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'White', 'Navy', 'Grey', 'Red'],
    features: ['100% Cotton', 'Machine Washable', 'Comfortable Fit', 'Breathable Fabric'],
    deliveryOptions: ['Standard Delivery (3-5 days)', 'Express Delivery (1-2 days)', 'Same Day Delivery (Selected areas)']
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await fetchProductById(id);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product details');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!auth.currentUser) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    try {
      // Wait for user to be fully authenticated
      await auth.currentUser.getIdToken(true);
      await addToCart(id, quantity);
      toast.success(`Added ${quantity} item(s) to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (error.message.includes('Authentication failed') || error.message.includes('unauthorized')) {
        toast.error('Please login again to continue');
        navigate('/login');
      } else {
        toast.error('Failed to add item to cart');
      }
    }
  };

  const handleBuyNow = async () => {
    if (!auth.currentUser) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }

    await handleAddToCart();
    navigate('/cart');
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} style={{ color: '#ffc107' }} />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" style={{ color: '#ffc107' }} />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} style={{ color: '#ffc107' }} />);
    }

    return stars;
  };

  const checkPincode = () => {
    if (pincode.length === 6) {
      setShowDeliveryInfo(true);
      toast.success('Delivery available in your area!');
    } else {
      toast.error('Please enter a valid 6-digit pincode');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mt-4">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading product details...</p>
          </div>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="container mt-4">
          <div className="alert alert-danger">Product not found</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb" style={{ 
            background: 'var(--color-card)', 
            padding: '12px 16px', 
            borderRadius: 'var(--radius)',
            border: '1px solid var(--color-border)',
            marginBottom: '0'
          }}>
            <li className="breadcrumb-item">
              <a href="/" style={{ 
                color: 'var(--color-primary)', 
                textDecoration: 'none',
                fontWeight: '500'
              }}>
                Home
              </a>
            </li>
            <li className="breadcrumb-item" style={{ color: 'var(--color-accent)' }}>
              /
            </li>
            <li className="breadcrumb-item active" style={{ 
              color: 'var(--color-text)',
              fontWeight: '600'
            }}>
              {product.category || 'Ribbed Collar T-shirt'}
            </li>
          </ol>
        </nav>

        <div className="row">
          <div className="col-md-6">
            <div className="product-image-container">
              <img 
                src={product.image_path} 
                alt={product.title}
                className="img-fluid rounded"
                style={{ width: '100%', maxHeight: '600px', objectFit: 'contain' }}
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="product-info">
              <h1 className="product-title" style={{ 
                fontFamily: 'var(--font-heading)',
                color: 'var(--color-primary)',
                fontSize: '1.8rem',
                fontWeight: '700',
                marginBottom: '1rem'
              }}>
                {product.title}
              </h1>
              
              <div className="rating-section mb-3">
                <div className="d-flex align-items-center">
                  <div className="stars me-2">
                    {renderStars(product.ratings || 4.0)}
                  </div>
                  <span className="rating-text">
                    {product.ratings || 4.0} ({product.review_count || 100} reviews)
                  </span>
                </div>
              </div>

              <div className="price-section mb-4" style={{
                background: 'var(--color-card)',
                padding: '16px 20px',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--color-border)',
                boxShadow: '0 4px 12px rgba(75, 15, 43, 0.08)'
              }}>
                <div className="d-flex align-items-center flex-wrap gap-2">
                  <span className="current-price" style={{
                    fontSize: '2rem',
                    fontWeight: '700',
                    color: 'var(--color-accent)',
                    fontFamily: 'var(--font-heading)'
                  }}>
                    ₹{product.discounted_price}
                  </span>
                  {product.actual_price > product.discounted_price && (
                    <>
                      <span className="original-price" style={{
                        fontSize: '1.2rem',
                        color: '#999',
                        textDecoration: 'line-through',
                        fontWeight: '500'
                      }}>
                        ₹{product.actual_price}
                      </span>
                      <span className="discount-badge" style={{
                        background: 'var(--color-primary)',
                        color: 'var(--color-card)',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        border: '2px solid var(--color-accent)'
                      }}>
                        {product.discount_percentage}% OFF
                      </span>
                    </>
                  )}
                </div>
                <div className="mt-2" style={{ color: 'var(--color-text)', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--color-primary)', fontWeight: '600' }}>
                    You save: ₹{product.actual_price - product.discounted_price}
                  </span>
                </div>
              </div>

              <div className="product-options mb-4" style={{
                background: 'var(--color-card)',
                padding: '20px',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--color-border)',
                boxShadow: '0 4px 12px rgba(75, 15, 43, 0.08)'
              }}>
                <div className="size-selector mb-3">
                  <label className="form-label" style={{ 
                    fontWeight: '600', 
                    color: 'var(--color-primary)',
                    marginBottom: '8px',
                    display: 'block'
                  }}>
                    Size:
                  </label>
                  <div className="d-flex gap-2">
                    {['S', 'M', 'L', 'XL'].map(size => (
                      <button
                        key={size}
                        className="btn btn-sm"
                        onClick={() => setSelectedSize(size)}
                        style={{ 
                          minWidth: '45px', 
                          height: '40px',
                          backgroundColor: selectedSize === size ? 'var(--color-primary)' : 'var(--color-card)',
                          borderColor: 'var(--color-accent)',
                          color: selectedSize === size ? 'var(--color-card)' : 'var(--color-primary)',
                          fontWeight: '600',
                          borderRadius: '8px',
                          border: '2px solid var(--color-accent)',
                          transition: 'var(--transition)'
                        }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="color-selector mb-3">
                  <label className="form-label" style={{ 
                    fontWeight: '600', 
                    color: 'var(--color-primary)',
                    marginBottom: '8px',
                    display: 'block'
                  }}>
                    Color:
                  </label>
                  <div className="d-flex gap-2">
                    {['Blue', 'Green', 'Black'].map(color => (
                      <button
                        key={color}
                        className="btn btn-sm"
                        onClick={() => setSelectedColor(color)}
                        style={{ 
                          minWidth: '80px', 
                          height: '40px',
                          backgroundColor: selectedColor === color ? 'var(--color-primary)' : 'var(--color-card)',
                          borderColor: 'var(--color-accent)',
                          color: selectedColor === color ? 'var(--color-card)' : 'var(--color-primary)',
                          fontWeight: '600',
                          borderRadius: '8px',
                          border: '2px solid var(--color-accent)',
                          transition: 'var(--transition)'
                        }}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="quantity-selector mb-3">
                  <label className="form-label" style={{ 
                    fontWeight: '600', 
                    color: 'var(--color-primary)',
                    marginBottom: '8px',
                    display: 'block'
                  }}>
                    Quantity:
                  </label>
                  <div className="d-flex align-items-center gap-2">
                    <button 
                      className="btn"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      style={{ 
                        width: '45px', 
                        height: '45px',
                        backgroundColor: 'var(--color-card)',
                        border: '2px solid var(--color-accent)',
                        color: 'var(--color-primary)',
                        fontWeight: '600',
                        borderRadius: '8px',
                        fontSize: '1.2rem'
                      }}
                    >
                      -
                    </button>
                    <span 
                      className="px-3 py-2 text-center"
                      style={{ 
                        minWidth: '70px', 
                        display: 'inline-block', 
                        lineHeight: '1.2',
                        fontWeight: '700',
                        fontSize: '1.1rem',
                        color: 'var(--color-primary)',
                        background: 'var(--color-bg)',
                        border: '2px solid var(--color-border)',
                        borderRadius: '8px'
                      }}
                    >
                      {quantity}
                    </span>
                    <button 
                      className="btn"
                      onClick={() => setQuantity(quantity + 1)}
                      style={{ 
                        width: '45px', 
                        height: '45px',
                        backgroundColor: 'var(--color-card)',
                        border: '2px solid var(--color-accent)',
                        color: 'var(--color-primary)',
                        fontWeight: '600',
                        borderRadius: '8px',
                        fontSize: '1.2rem'
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="action-buttons mb-4">
                <div className="d-flex gap-3">
                  <button 
                    className="btn flex-fill btn-primary-custom"
                    onClick={handleAddToCart}
                    style={{ 
                      background: 'var(--color-primary)',
                      border: '2px solid var(--color-accent)',
                      color: 'var(--color-card)',
                      padding: '14px 24px',
                      fontWeight: '600',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      transition: 'var(--transition)'
                    }}
                  >
                    Add to Cart
                  </button>
                  <button 
                    className={`btn ${isWishlisted ? 'btn-danger' : 'btn-outline-danger'}`}
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    style={{ 
                      width: '60px', 
                      padding: '14px',
                      backgroundColor: isWishlisted ? 'var(--color-primary)' : 'var(--color-card)',
                      border: '2px solid var(--color-accent)',
                      color: isWishlisted ? 'var(--color-card)' : 'var(--color-primary)',
                      borderRadius: '8px',
                      fontSize: '1.1rem'
                    }}
                  >
                    {isWishlisted ? <FaHeart /> : <FaRegHeart />}
                  </button>
                </div>
              </div>

              {/* Product Details Tabs - Moved here for better visibility */}
              <div className="product-details-section mt-4">
                <ul className="nav nav-tabs mb-3">
                  <li className="nav-item">
                    <button 
                      className="nav-link"
                      onClick={() => setActiveTab('details')}
                      style={{
                        backgroundColor: activeTab === 'details' ? 'var(--color-primary)' : 'transparent',
                        color: activeTab === 'details' ? 'white' : 'var(--color-text)',
                        border: '1px solid var(--color-primary)',
                        borderRadius: '4px',
                        marginRight: '8px'
                      }}
                    >
                      Details
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className="nav-link"
                      onClick={() => setActiveTab('features')}
                      style={{
                        backgroundColor: activeTab === 'features' ? 'var(--color-primary)' : 'transparent',
                        color: activeTab === 'features' ? 'white' : 'var(--color-text)',
                        border: '1px solid var(--color-primary)',
                        borderRadius: '4px',
                        marginRight: '8px'
                      }}
                    >
                      Features
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className="nav-link"
                      onClick={() => setActiveTab('reviews')}
                      style={{
                        backgroundColor: activeTab === 'reviews' ? 'var(--color-primary)' : 'transparent',
                        color: activeTab === 'reviews' ? 'white' : 'var(--color-text)',
                        border: '1px solid var(--color-primary)',
                        borderRadius: '4px'
                      }}
                    >
                      Reviews
                    </button>
                  </li>
                </ul>

                <div className="tab-content" style={{
                  background: 'var(--color-card)',
                  padding: '20px',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--color-border)',
                  minHeight: '200px'
                }}>
                  {activeTab === 'details' && (
                    <div className="tab-pane active">
                      <h5 style={{ color: 'var(--color-primary)', marginBottom: '12px' }}>Description</h5>
                      <p style={{ color: 'var(--color-text)' }}>{product.description}</p>
                      {product.short_description && (
                        <p style={{ color: 'var(--color-text)' }}><strong>Summary:</strong> {product.short_description}</p>
                      )}
                    </div>
                  )}
                  
                  {activeTab === 'features' && (
                    <div className="tab-pane active">
                      {product.additional_details && (
                        <ul style={{ color: 'var(--color-text)' }}>
                          {typeof product.additional_details === 'object' 
                            ? Object.entries(product.additional_details).map(([key, value]) => (
                                <li key={key}><strong>{key}:</strong> {value}</li>
                              ))
                            : <li>{product.additional_details}</li>
                          }
                        </ul>
                      )}
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <div className="tab-pane active" style={{ color: 'var(--color-text)' }}>
                      <div className="review mb-4 pb-3 border-bottom">
                        <div className="d-flex align-items-center mb-2">
                          <strong>Priya S.</strong>
                          <div className="ms-2">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} style={{ color: '#ffc107' }}>★</span>
                            ))}
                          </div>
                        </div>
                        <p>Excellent quality and perfect fit! The material is very comfortable and the color is exactly as shown. Highly recommended!</p>
                      </div>
                      
                      <div className="review mb-4 pb-3 border-bottom">
                        <div className="d-flex align-items-center mb-2">
                          <strong>Rahul M.</strong>
                          <div className="ms-2">
                            {[...Array(4)].map((_, i) => (
                              <span key={i} style={{ color: '#ffc107' }}>★</span>
                            ))}
                            <span style={{ color: '#ddd' }}>★</span>
                          </div>
                        </div>
                        <p>Good product overall. Fast delivery and nice packaging. The size runs slightly large, so consider ordering one size smaller.</p>
                      </div>
                      
                      <div className="review mb-4">
                        <div className="d-flex align-items-center mb-2">
                          <strong>Anjali K.</strong>
                          <div className="ms-2">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} style={{ color: '#ffc107' }}>★</span>
                            ))}
                          </div>
                        </div>
                        <p>Amazing quality for the price! Very satisfied with the purchase. The fabric is soft and the stitching is perfect. Will definitely buy again.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-5" style={{ display: 'none' }}>
          <div className="col-12">
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
