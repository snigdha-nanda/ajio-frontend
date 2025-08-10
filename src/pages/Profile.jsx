
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { fetchProfile } from '../api/backendApi';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await loadProfile();
      } else {
        navigate('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const loadProfile = async () => {
    try {
      const profileData = await fetchProfile();
      setProfile(profileData);
    } catch (error) {
      console.error('Failed to load profile:', error);
      toast.error('Failed to load profile');
    }
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
            <p className="mt-2">Loading profile...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card" style={{ 
              background: 'var(--color-card)', 
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)'
            }}>
              <div className="card-header" style={{ 
                backgroundColor: 'var(--color-primary)', 
                color: 'var(--color-card)',
                borderRadius: 'var(--radius) var(--radius) 0 0'
              }}>
                <h4 style={{ margin: 0, fontFamily: 'var(--font-heading)' }}>My Profile</h4>
              </div>
              
              <div className="card-body" style={{ padding: '2rem' }}>
                <div className="row">
                  <div className="col-md-4 text-center mb-4">
                    <div 
                      className="rounded-circle d-inline-flex align-items-center justify-content-center"
                      style={{
                        width: '100px',
                        height: '100px',
                        backgroundColor: 'var(--color-primary)',
                        color: 'var(--color-card)',
                        fontSize: '2rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {profile?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  
                  <div className="col-md-8">
                    <div className="mb-3">
                      <label className="form-label" style={{ color: 'var(--color-primary)', fontWeight: '600' }}>
                        Username
                      </label>
                      <div 
                        className="form-control" 
                        style={{ 
                          backgroundColor: 'var(--color-bg)',
                          border: '2px solid var(--color-border)',
                          color: 'var(--color-text)'
                        }}
                      >
                        {profile?.username || user?.email?.split('@')[0]}
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label" style={{ color: 'var(--color-primary)', fontWeight: '600' }}>
                        Email
                      </label>
                      <div 
                        className="form-control" 
                        style={{ 
                          backgroundColor: 'var(--color-bg)',
                          border: '2px solid var(--color-border)',
                          color: 'var(--color-text)'
                        }}
                      >
                        {profile?.email || user?.email}
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label" style={{ color: 'var(--color-primary)', fontWeight: '600' }}>
                        Member Since
                      </label>
                      <div 
                        className="form-control" 
                        style={{ 
                          backgroundColor: 'var(--color-bg)',
                          border: '2px solid var(--color-border)',
                          color: 'var(--color-text)'
                        }}
                      >
                        {profile?.joined_date ? new Date(profile.joined_date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        }) : 'Recently'}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center mt-4">
                  <button 
                    className="btn btn-primary-custom me-3"
                    onClick={() => navigate('/orders')}
                  >
                    View Order History
                  </button>
                  <button 
                    className="btn btn-outline"
                    onClick={() => navigate('/')}
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
