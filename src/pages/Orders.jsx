
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { fetchOrders } from '../api/backendApi';

const Orders = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await loadOrders();
      } else {
        navigate('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const loadOrders = async () => {
    try {
      const ordersData = await fetchOrders();
      setOrders(ordersData);
    } catch (error) {
      console.error('Failed to load orders:', error);
      toast.error('Failed to load orders');
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'var(--color-accent)';
      case 'shipped': return '#007bff';
      case 'processing': return '#ffc107';
      case 'cancelled': return 'var(--color-primary)';
      default: return 'var(--color-text)';
    }
  };

  const formatStatus = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mt-4">
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading orders...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>
            Order History
          </h2>
          <button 
            className="btn btn-outline"
            onClick={() => navigate('/profile')}
          >
            Back to Profile
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-5">
            <div style={{
              background: 'var(--color-card)',
              padding: '3rem 2rem',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--color-border)'
            }}>
              <h4 style={{ color: 'var(--color-primary)' }}>No Orders Yet</h4>
              <p style={{ color: 'var(--color-text)', marginBottom: '2rem' }}>
                You haven't placed any orders yet. Start shopping to see your order history here.
              </p>
              <button 
                className="btn btn-primary-custom"
                onClick={() => navigate('/')}
              >
                Start Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="row">
            {orders.map((order) => (
              <div key={order.id} className="col-12 mb-3">
                <div className="card" style={{ 
                  background: 'var(--color-card)', 
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)'
                }}>
                  <div className="card-body" style={{ padding: '1.5rem' }}>
                    <div className="row align-items-center">
                      <div className="col-md-3">
                        <h6 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                          Order #{order.order_number}
                        </h6>
                        <small style={{ color: 'var(--color-text)' }}>
                          {new Date(order.order_date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </small>
                      </div>
                      
                      <div className="col-md-2">
                        <span 
                          className="badge px-3 py-2"
                          style={{ 
                            backgroundColor: getStatusColor(order.status),
                            color: 'white',
                            fontSize: '0.8rem'
                          }}
                        >
                          {formatStatus(order.status)}
                        </span>
                      </div>
                      
                      <div className="col-md-2">
                        <div style={{ color: 'var(--color-text)' }}>
                          <small>Items: {order.item_count}</small>
                        </div>
                      </div>
                      
                      <div className="col-md-3">
                        <div style={{ color: 'var(--color-primary)', fontWeight: '600' }}>
                          Total: ₹{parseFloat(order.total_amount).toFixed(2)}
                        </div>
                      </div>
                      
                      <div className="col-md-2 text-end">
                        <button 
                          className="btn btn-outline btn-sm"
                          style={{ fontSize: '0.8rem' }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Orders;
