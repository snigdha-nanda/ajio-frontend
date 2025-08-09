import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import Navbar from '../components/Navbar';
import ConfigModal from '../components/ConfigModal';
import { getCartItems, updateQuantity, removeFromCart } from '../utils/cartService';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, key: '', title: '' });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    cardholderName: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
      if (user) {
        loadCartItems();
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadCartItems = async () => {
    try {
      setLoading(true);
      const items = await getCartItems();
      setCartItems(items);
    } catch (error) {
      console.error('Failed to load cart:', error);
      toast.error('Failed to load cart items');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      setUpdating(true);
      await updateQuantity(productId, newQuantity);
      await loadCartItems();
      toast.success('Cart updated successfully');
    } catch (error) {
      console.error('Failed to update quantity:', error);
      toast.error('Failed to update cart');
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      setUpdating(true);
      await removeFromCart(productId);
      await loadCartItems();
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Failed to remove item:', error);
      toast.error('Failed to remove item');
    } finally {
      setUpdating(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const openModal = (key, title) => {
    setModalConfig({ isOpen: true, key, title });
  };

  const closeModal = () => {
    setModalConfig({ isOpen: false, key: '', title: '' });
  };

  const handleCheckout = () => {
    setShowPaymentModal(true);
    setPaymentForm({ cardNumber: '', expiry: '', cvv: '', cardholderName: '' });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    
    // Card number validation (16 digits)
    if (!paymentForm.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
      errors.cardNumber = 'Card number must be 16 digits';
    }
    
    // Expiry validation (MM/YY format)
    if (!paymentForm.expiry.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
      errors.expiry = 'Enter valid expiry (MM/YY)';
    }
    
    // CVV validation (3 digits)
    if (!paymentForm.cvv.match(/^\d{3}$/)) {
      errors.cvv = 'CVV must be 3 digits';
    }
    
    // Cardholder name validation
    if (!paymentForm.cardholderName.trim() || paymentForm.cardholderName.trim().length < 2) {
      errors.cardholderName = 'Enter valid cardholder name';
    }
    
    return errors;
  };

  const handleInputChange = (field, value) => {
    let formattedValue = value;
    
    // Format card number with spaces
    if (field === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) formattedValue = formattedValue.slice(0, 19);
    }
    
    // Format expiry with slash
    if (field === 'expiry') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
      if (formattedValue.length > 5) formattedValue = formattedValue.slice(0, 5);
    }
    
    // Limit CVV to 3 digits
    if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 3);
    }
    
    setPaymentForm(prev => ({ ...prev, [field]: formattedValue }));
    
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePayment = async () => {
    const errors = validateForm();
    setFormErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      toast.error('Please fix the form errors');
      return;
    }
    
    setPaymentProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setPaymentProcessing(false);
      setShowPaymentModal(false);
      toast.success('Payment successful! Order placed.');
      setCartItems([]); // Clear cart after successful payment
    }, 2000);
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
            <p className="mt-2">Loading your cart...</p>
          </div>
        </div>
      </>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <div className="container mt-4">
          <div className="text-center py-5">
            <div style={{
              background: 'var(--color-card)',
              padding: '3rem 2rem',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--color-border)',
              maxWidth: '500px',
              margin: '0 auto'
            }}>
              <h3 style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>
                Please Login
              </h3>
              <p style={{ color: 'var(--color-text)', marginBottom: '2rem' }}>
                You need to be logged in to view your cart items.
              </p>
              <button 
                className="btn btn-primary-custom"
                onClick={() => navigate('/login')}
                style={{ padding: '12px 24px', fontSize: '1rem' }}
              >
                Login Now
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2 className="mb-4" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>Shopping Cart</h2>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-5">
            <h4 style={{ color: 'var(--color-primary)' }}>Your cart is empty</h4>
            <p className="text-muted">Add some products to get started!</p>
            <a href="/" className="btn btn-primary-custom">Continue Shopping</a>
          </div>
        ) : (
          <div className="row">
            <div className="col-lg-8">
              {cartItems.map((item) => (
                <div key={item.id} className="card mb-3" style={{ 
                  background: 'var(--color-card)', 
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)'
                }}>
                  <div className="card-body">
                    <div className="row align-items-center">
                      <div className="col-md-2">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="img-fluid rounded"
                          style={{ maxHeight: '80px', objectFit: 'contain' }}
                        />
                      </div>
                      <div className="col-md-4">
                        <h6 className="card-title" style={{ color: 'var(--color-primary)' }}>{item.title}</h6>
                        <p className="fw-bold" style={{ color: 'var(--color-accent)' }}>₹{item.price}</p>
                      </div>
                      <div className="col-md-3">
                        <div className="d-flex align-items-center gap-2">
                          <button 
                            className="btn btn-sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={updating || item.quantity <= 1}
                            style={{
                              width: '35px',
                              height: '35px',
                              backgroundColor: 'var(--color-card)',
                              border: '2px solid var(--color-accent)',
                              color: 'var(--color-primary)',
                              borderRadius: '6px'
                            }}
                          >
                            -
                          </button>
                          <span 
                            className="px-3 py-1 text-center fw-bold"
                            style={{
                              minWidth: '50px',
                              backgroundColor: 'var(--color-bg)',
                              border: '2px solid var(--color-border)',
                              borderRadius: '6px',
                              color: 'var(--color-primary)',
                              fontSize: '1rem'
                            }}
                          >
                            {item.quantity}
                          </span>
                          <button 
                            className="btn btn-sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={updating}
                            style={{
                              width: '35px',
                              height: '35px',
                              backgroundColor: 'var(--color-card)',
                              border: '2px solid var(--color-accent)',
                              color: 'var(--color-primary)',
                              borderRadius: '6px'
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <p className="fw-bold" style={{ color: 'var(--color-primary)' }}>₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <div className="col-md-1">
                        <button 
                          className="btn btn-sm"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={updating}
                          style={{
                            backgroundColor: 'var(--color-primary)',
                            border: '2px solid var(--color-accent)',
                            color: 'var(--color-card)',
                            borderRadius: '6px',
                            width: '35px',
                            height: '35px'
                          }}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="col-lg-4">
              <div className="order-summary">
                <div className="card-header" style={{ 
                  backgroundColor: 'var(--color-primary)', 
                  color: 'var(--color-card)',
                  borderRadius: 'var(--radius) var(--radius) 0 0',
                  padding: '1rem'
                }}>
                  <h5 style={{ margin: 0, fontFamily: 'var(--font-heading)' }}>Order Summary</h5>
                </div>
                <div className="card-body" style={{ padding: '1.5rem' }}>
                  <div className="d-flex justify-content-between mb-2">
                    <span style={{ color: 'var(--color-text)' }}>Subtotal:</span>
                    <span style={{ color: 'var(--color-primary)', fontWeight: '600' }}>₹{calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span style={{ color: 'var(--color-text)' }}>Shipping:</span>
                    <span style={{ color: 'var(--color-accent)', fontWeight: '600' }}>Free</span>
                  </div>
                  <hr style={{ borderColor: 'var(--color-border)' }} />
                  <div className="d-flex justify-content-between mb-3">
                    <strong style={{ color: 'var(--color-primary)' }}>Total:</strong>
                    <strong style={{ color: 'var(--color-accent)', fontSize: '1.2rem' }}>₹{calculateTotal().toFixed(2)}</strong>
                  </div>
                  <button 
                    className="btn btn-primary-custom w-100"
                    onClick={handleCheckout}
                    disabled={updating}
                    style={{ padding: '12px', fontSize: '1rem', fontWeight: '600' }}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ 
              background: 'var(--color-card)', 
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)'
            }}>
              <div className="modal-header" style={{ 
                backgroundColor: 'var(--color-primary)', 
                color: 'var(--color-card)',
                borderRadius: 'var(--radius) var(--radius) 0 0'
              }}>
                <h5 className="modal-title" style={{ fontFamily: 'var(--font-heading)' }}>Payment Details</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowPaymentModal(false)}
                  disabled={paymentProcessing}
                  style={{ filter: 'invert(1)' }}
                ></button>
              </div>
              <div className="modal-body" style={{ padding: '2rem' }}>
                <div className="mb-3">
                  <h6 style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>Order Total: ₹{calculateTotal().toFixed(2)}</h6>
                </div>
                
                <div className="mb-3">
                  <label className="form-label" style={{ color: 'var(--color-primary)', fontWeight: '600' }}>Card Number</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="1234 5678 9012 3456"
                    value={paymentForm.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                    disabled={paymentProcessing}
                    style={{ 
                      border: formErrors.cardNumber ? '2px solid var(--color-primary)' : '2px solid var(--color-border)',
                      borderRadius: '8px'
                    }}
                  />
                  {formErrors.cardNumber && (
                    <small style={{ color: 'var(--color-primary)', fontSize: '0.8rem' }}>
                      {formErrors.cardNumber}
                    </small>
                  )}
                </div>
                
                <div className="row mb-3">
                  <div className="col-6">
                    <label className="form-label" style={{ color: 'var(--color-primary)', fontWeight: '600' }}>Expiry</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="MM/YY"
                      value={paymentForm.expiry}
                      onChange={(e) => handleInputChange('expiry', e.target.value)}
                      disabled={paymentProcessing}
                      style={{ 
                        border: formErrors.expiry ? '2px solid var(--color-primary)' : '2px solid var(--color-border)',
                        borderRadius: '8px'
                      }}
                    />
                    {formErrors.expiry && (
                      <small style={{ color: 'var(--color-primary)', fontSize: '0.8rem' }}>
                        {formErrors.expiry}
                      </small>
                    )}
                  </div>
                  <div className="col-6">
                    <label className="form-label" style={{ color: 'var(--color-primary)', fontWeight: '600' }}>CVV</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="123"
                      value={paymentForm.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value)}
                      disabled={paymentProcessing}
                      style={{ 
                        border: formErrors.cvv ? '2px solid var(--color-primary)' : '2px solid var(--color-border)',
                        borderRadius: '8px'
                      }}
                    />
                    {formErrors.cvv && (
                      <small style={{ color: 'var(--color-primary)', fontSize: '0.8rem' }}>
                        {formErrors.cvv}
                      </small>
                    )}
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label" style={{ color: 'var(--color-primary)', fontWeight: '600' }}>Cardholder Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="John Doe"
                    value={paymentForm.cardholderName}
                    onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                    disabled={paymentProcessing}
                    style={{ 
                      border: formErrors.cardholderName ? '2px solid var(--color-primary)' : '2px solid var(--color-border)',
                      borderRadius: '8px'
                    }}
                  />
                  {formErrors.cardholderName && (
                    <small style={{ color: 'var(--color-primary)', fontSize: '0.8rem' }}>
                      {formErrors.cardholderName}
                    </small>
                  )}
                </div>
              </div>
              <div className="modal-footer" style={{ padding: '1rem 2rem' }}>
                <button 
                  type="button" 
                  className="btn btn-outline me-2"
                  onClick={() => setShowPaymentModal(false)}
                  disabled={paymentProcessing}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary-custom"
                  onClick={handlePayment}
                  disabled={paymentProcessing}
                  style={{ minWidth: '120px' }}
                >
                  {paymentProcessing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Processing...
                    </>
                  ) : (
                    'Pay Now'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfigModal 
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        configKey={modalConfig.key}
        title={modalConfig.title}
      />
    </>
  );
};

export default CartPage;
