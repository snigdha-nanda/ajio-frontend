import React, { useState, useEffect } from 'react';

const brands = [
    { image: '/images/top-brands/Benetton.jpeg', text: 'UP TO 50% OFF*' },
    { image: '/images/top-brands/BeverlyPolo.jpeg', text: 'UP TO 50% OFF*' },
    { image: '/images/top-brands/Dennis.jpeg', text: 'UP TO 50% OFF*' },
    { image: '/images/top-brands/FILA.jpeg', text: 'UP TO 60% OFF*' },
    { image: '/images/top-brands/GANT.jpeg', text: '30-60% OFF*' },
    { image: '/images/top-brands/KETCH.jpeg', text: '40-60% OFF*' },
];

const brands2 = [
    { image: '/images/top-brands/PepeJeans.jpeg', text: '30-60% OFF*' },
    { image: '/images/top-brands/Reebok.jpeg', text: 'MIN. 60% OFF*' },
    { image: '/images/top-brands/Snitch.jpeg', text: '40-70% OFF*' },
    { image: '/images/top-brands/VanHeusen.jpeg', text: 'MIN. 60% OFF*' },
    { image: '/images/brands/Campus.jpeg', text: '50% OFF*' },
    { image: '/images/brands/Levis.jpeg', text: '40% OFF*' },
];

const TopBrands = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [brands, brands2];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section style={{
      background: 'var(--color-primary)',
      padding: '2rem 0',
      marginBottom: '2rem'
    }}>
      <h2 style={{
        textAlign: 'center',
        fontSize: '2rem',
        fontWeight: '700',
        color: 'var(--color-bg)',
        marginBottom: '2rem',
        fontFamily: 'var(--font-heading)'
      }}>Top Brands</h2>
      <div className="container" style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Single horizontal line of brands */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          padding: '0 1rem',
          flexWrap: 'wrap'
        }}>
          {slides[currentSlide].map((b, i) => (
            <div key={i} style={{
              position: 'relative',
              borderRadius: '50%',
              overflow: 'hidden',
              width: '150px',
              height: '150px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: '0 0 auto',
              border: `2px solid var(--color-accent)`
            }}>
              <img
                src={b.image}
                alt=""
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(249, 241, 231, 0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%'
              }}>
                <span style={{
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: 'var(--color-primary)',
                  textAlign: 'center',
                  padding: '0 0.5rem',
                  fontFamily: 'var(--font-body)'
                }}>{b.text}</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Simple slide indicators */}
        <div style={{
          textAlign: 'center',
          marginTop: '1.5rem'
        }}>
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: 'none',
                background: currentSlide === index ? 'var(--color-accent)' : 'var(--color-bg)',
                cursor: 'pointer',
                margin: '0 0.25rem',
                transition: 'var(--transition)',
                opacity: currentSlide === index ? 1 : 0.6
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopBrands;
