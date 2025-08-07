import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const slides = [
  {
    image: '/images/carousel/ClothingCarnival.jpeg',
    subtitle: 'STYLE FIESTA',
    title: 'FOOTWEAR CARNIVAL',
    discount: '30-60% OFF*',
    brands: [
      { src: '/images/brands/Campus.jpeg', alt: 'Campus' },
      { src: '/images/brands/Levis.jpeg', alt: 'Levis' },
    ],
    moreText: '& more',
  },
  {
    image: '/images/carousel/Footwear.jpeg',
    subtitle: 'FASHION SALE',
    title: 'CLOTHING BONANZA',
    discount: '40-70% OFF*',
    brands: [
      { src: '/images/brands/AllenSolly.jpeg', alt: 'Allen Solly' },
      { src: '/images/brands/Superdry.jpeg', alt: 'Superdry' },
    ],
    moreText: '& more',
  },
];

const Carousel = () => {
  const [current, setCurrent] = useState(0);
  const length = slides.length;

  // auto-advance every 5s
  useEffect(() => {
    const iv = setInterval(() => setCurrent(i => (i + 1) % length), 5000);
    return () => clearInterval(iv);
  }, [length]);

  return (
    <div className="card" style={{height: '400px', position: 'relative', overflow: 'hidden'}}>
      {slides.map((slide, i) => (
        <div
          key={i}
          style={{
            opacity: i === current ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          }}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            height: '100%',
            padding: '1rem'
          }}>
            {/* Left: big image */}
            <div style={{
              width: '50%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <img
                src={slide.image}
                alt={slide.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  borderRadius: '10px'
                }}
              />
            </div>
            {/* Right: text & logos */}
            <div style={{
              width: '50%',
              textAlign: 'center',
              padding: '0 1.5rem'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                {slide.brands.map((b, idx) => (
                  <img 
                    key={idx} 
                    src={b.src} 
                    alt={b.alt} 
                    style={{
                      height: '32px', 
                      objectFit: 'contain',
                      marginRight: '0.75rem'
                    }} 
                  />
                ))}
                <span style={{fontWeight: '600', color: 'var(--color-primary)'}}>{slide.moreText}</span>
              </div>
              <h2 style={{
                fontSize: '2rem',
                fontWeight: '700',
                marginBottom: '0.5rem',
                color: 'var(--color-primary)',
                fontFamily: 'var(--font-heading)'
              }}>{slide.subtitle}</h2>
              <h3 style={{
                fontSize: '1.25rem',
                marginBottom: '1rem',
                textTransform: 'uppercase',
                color: 'var(--color-text)'
              }}>{slide.title}</h3>
              <p style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                marginBottom: '1rem',
                color: 'var(--color-accent)'
              }}>{slide.discount}</p>
              <button className="btn-primary-custom">
                SHOP
              </button>
              <p style={{
                fontSize: '0.75rem',
                color: '#5f4d6a',
                marginTop: '0.5rem'
              }}>* T&C APPLY</p>
            </div>
          </div>
        </div>
      ))}

      {/* Prev/Next controls */}
      <button
        onClick={() => setCurrent((current - 1 + length) % length)}
        style={{
          position: 'absolute',
          top: '50%',
          left: '1rem',
          transform: 'translateY(-50%)',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          border: '2px solid var(--color-accent)',
          background: 'var(--color-card)',
          color: 'var(--color-primary)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.2rem',
          transition: 'var(--transition)'
        }}
        onMouseOver={(e) => e.target.style.background = 'var(--color-accent)'}
        onMouseOut={(e) => e.target.style.background = 'var(--color-card)'}
      >
        <FaChevronLeft />
      </button>
      <button
        onClick={() => setCurrent((current + 1) % length)}
        style={{
          position: 'absolute',
          top: '50%',
          right: '1rem',
          transform: 'translateY(-50%)',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          border: '2px solid var(--color-accent)',
          background: 'var(--color-card)',
          color: 'var(--color-primary)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.2rem',
          transition: 'var(--transition)'
        }}
        onMouseOver={(e) => e.target.style.background = 'var(--color-accent)'}
        onMouseOut={(e) => e.target.style.background = 'var(--color-card)'}
      >
        <FaChevronRight />
      </button>

      {/* Slide indicators */}
      <div style={{
        position: 'absolute',
        bottom: '1rem',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '0.5rem'
      }}>
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              border: 'none',
              background: current === index ? 'var(--color-accent)' : 'var(--color-border)',
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
