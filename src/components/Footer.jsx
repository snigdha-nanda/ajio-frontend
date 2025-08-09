import React, { useState, useEffect } from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaPinterest } from 'react-icons/fa';
import ConfigModal from './ConfigModal';
import { fetchConfig } from '../api/backendApi';

const Footer = () => {
  const [modalConfig, setModalConfig] = useState({ isOpen: false, key: '', title: '' });
  const [socialLinks, setSocialLinks] = useState({});

  useEffect(() => {
    loadSocialLinks();
  }, []);

  const loadSocialLinks = async () => {
    try {
      const [facebook, instagram, twitter, pinterest] = await Promise.all([
        fetchConfig('social_facebook').catch(() => ({ value: 'https://facebook.com' })),
        fetchConfig('social_instagram').catch(() => ({ value: 'https://instagram.com' })),
        fetchConfig('social_twitter').catch(() => ({ value: 'https://twitter.com' })),
        fetchConfig('social_pinterest').catch(() => ({ value: 'https://pinterest.com' }))
      ]);
      
      setSocialLinks({
        facebook: facebook.value,
        instagram: instagram.value,
        twitter: twitter.value,
        pinterest: pinterest.value
      });
    } catch (error) {
      console.error('Failed to load social links:', error);
    }
  };

  const openModal = (key, title) => {
    setModalConfig({ isOpen: true, key, title });
  };

  const closeModal = () => {
    setModalConfig({ isOpen: false, key: '', title: '' });
  };

  return (
    <>
      <footer style={{
        background: 'var(--color-primary)',
        color: 'var(--color-bg)',
        padding: '2rem 0 1rem'
      }}>
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            {/* Column 1: Ajio */}
            <div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: 'var(--color-accent)',
                fontFamily: 'var(--font-heading)'
              }}>Ajio</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '0.5rem' }}>
                  <button 
                    onClick={() => openModal('terms_conditions', 'Terms & Conditions')}
                    style={{ 
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-bg)', 
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      opacity: 0.9,
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Terms & Conditions
                  </button>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <button 
                    onClick={() => openModal('privacy_policy', 'Privacy Policy')}
                    style={{ 
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-bg)', 
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      opacity: 0.9,
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Privacy Policy
                  </button>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <button 
                    onClick={() => openModal('returns_policy', 'Returns & Refunds Policy')}
                    style={{ 
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-bg)', 
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      opacity: 0.9,
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Returns & Refunds Policy
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 2: Help */}
            <div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: 'var(--color-accent)',
                fontFamily: 'var(--font-heading)'
              }}>Help</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '0.5rem' }}>
                  <button 
                    onClick={() => openModal('track_order', 'Track Your Order')}
                    style={{ 
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-bg)', 
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      opacity: 0.9,
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Track Your Order
                  </button>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <button 
                    onClick={() => openModal('returns_help', 'Returns')}
                    style={{ 
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-bg)', 
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      opacity: 0.9,
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Returns
                  </button>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <button 
                    onClick={() => openModal('cancellations', 'Cancellations')}
                    style={{ 
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-bg)', 
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      opacity: 0.9,
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Cancellations
                  </button>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <button 
                    onClick={() => openModal('customer_care', 'Customer Care')}
                    style={{ 
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-bg)', 
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      opacity: 0.9,
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Customer Care
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Follow Us with icons */}
            <div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: 'var(--color-accent)',
                fontFamily: 'var(--font-heading)'
              }}>Follow Us</h3>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <a href={socialLinks.facebook || 'https://facebook.com'} target="_blank" rel="noopener noreferrer" style={{
                  color: 'var(--color-bg)',
                  fontSize: '1.5rem',
                  transition: 'var(--transition)',
                  opacity: 0.9
                }}>
                  <FaFacebookF />
                </a>
                <a href={socialLinks.instagram || 'https://instagram.com'} target="_blank" rel="noopener noreferrer" style={{
                  color: 'var(--color-bg)',
                  fontSize: '1.5rem',
                  transition: 'var(--transition)',
                  opacity: 0.9
                }}>
                  <FaInstagram />
                </a>
                <a href={socialLinks.twitter || 'https://twitter.com'} target="_blank" rel="noopener noreferrer" style={{
                  color: 'var(--color-bg)',
                  fontSize: '1.5rem',
                  transition: 'var(--transition)',
                  opacity: 0.9
                }}>
                  <FaTwitter />
                </a>
                <a href={socialLinks.pinterest || 'https://pinterest.com'} target="_blank" rel="noopener noreferrer" style={{
                  color: 'var(--color-bg)',
                  fontSize: '1.5rem',
                  transition: 'var(--transition)',
                  opacity: 0.9
                }}>
                  <FaPinterest />
                </a>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ marginTop: '2rem' }}>
            <hr style={{ 
              border: 'none', 
              borderTop: `1px solid var(--color-primary-hover)`, 
              margin: '1rem 0' 
            }} />
            <p style={{
              textAlign: 'center',
              fontSize: '0.9rem',
              color: 'var(--color-bg)',
              margin: 0,
              paddingBottom: '1rem',
              opacity: 0.8,
              fontFamily: 'var(--font-body)'
            }}>© 2025 AJIO Inspired Store. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <ConfigModal 
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        configKey={modalConfig.key}
        title={modalConfig.title}
      />
    </>
  );
};

export default Footer;
