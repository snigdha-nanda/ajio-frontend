import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaPinterest } from 'react-icons/fa';

const Footer = () => (
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
              <a href="/terms" style={{ 
                color: 'var(--color-bg)', 
                textDecoration: 'none',
                fontSize: '0.9rem',
                opacity: 0.9,
                transition: 'var(--transition)'
              }}>Terms & Conditions</a>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="/privacy" style={{ 
                color: 'var(--color-bg)', 
                textDecoration: 'none',
                fontSize: '0.9rem',
                opacity: 0.9,
                transition: 'var(--transition)'
              }}>Privacy Policy</a>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="/returns-policy" style={{ 
                color: 'var(--color-bg)', 
                textDecoration: 'none',
                fontSize: '0.9rem',
                opacity: 0.9,
                transition: 'var(--transition)'
              }}>Returns & Refunds Policy</a>
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
              <a href="/track-order" style={{ 
                color: 'var(--color-bg)', 
                textDecoration: 'none',
                fontSize: '0.9rem',
                opacity: 0.9,
                transition: 'var(--transition)'
              }}>Track Your Order</a>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="/returns" style={{ 
                color: 'var(--color-bg)', 
                textDecoration: 'none',
                fontSize: '0.9rem',
                opacity: 0.9,
                transition: 'var(--transition)'
              }}>Returns</a>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="/cancellations" style={{ 
                color: 'var(--color-bg)', 
                textDecoration: 'none',
                fontSize: '0.9rem',
                opacity: 0.9,
                transition: 'var(--transition)'
              }}>Cancellations</a>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="/customer-care" style={{ 
                color: 'var(--color-bg)', 
                textDecoration: 'none',
                fontSize: '0.9rem',
                opacity: 0.9,
                transition: 'var(--transition)'
              }}>Customer Care</a>
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
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{
              color: 'var(--color-bg)',
              fontSize: '1.5rem',
              transition: 'var(--transition)',
              opacity: 0.9
            }}>
              <FaFacebookF />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{
              color: 'var(--color-bg)',
              fontSize: '1.5rem',
              transition: 'var(--transition)',
              opacity: 0.9
            }}>
              <FaInstagram />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{
              color: 'var(--color-bg)',
              fontSize: '1.5rem',
              transition: 'var(--transition)',
              opacity: 0.9
            }}>
              <FaTwitter />
            </a>
            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" style={{
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
);

export default Footer;
