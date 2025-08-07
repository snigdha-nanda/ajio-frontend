import React from 'react';

const saleRows = [
  {
    title: 'CROWD PLEASERS Are Here!',
    bgColor: 'var(--color-primary)',
    items: [
      {
        image: '/images/sale/AllenSolly.jpeg',
        brandLogos: ['/images/brands/AllenSolly.jpeg'],
        discountText: 'MIN. 60% OFF*',
      },
      {
        image: '/images/sale/Campus.jpeg',
        brandLogos: ['/images/brands/Campus.jpeg'],
        discountText: 'FLAT 50% + EXTRA 10% OFF*',
      },
      {
        image: '/images/sale/LeeCooper.jpeg',
        brandLogos: ['/images/brands/LeeCooper.jpeg'],
        discountText: 'UP TO 60% OFF*',
      },
    ],
  },
  {
    title: 'Winter Wear Wonders!',
    bgColor: 'var(--color-primary-hover)',
    items: [
      {
        image: '/images/sale/Levis.jpeg',
        brandLogos: ['/images/brands/Levis.jpeg'],
        discountText: '30-50% OFF*',
      },
      {
        image: '/images/sale/Superdry.jpeg',
        brandLogos: ['/images/brands/Superdry.jpeg'],
        discountText: 'STARTING ₹499',
      },
      {
        image: '/images/sale/U.S.POLO.jpeg',
        brandLogos: ['/images/brands/U.S.POLO.jpeg'],
        discountText: 'MIN. 40% OFF*',
      },
    ],
  },
];

const SaleSection = () => (
  <div style={{ marginBottom: '2rem' }}>
    {saleRows.map((row, idx) => (
      <section key={idx} style={{
        background: row.bgColor,
        color: 'var(--color-bg)',
        padding: '2rem 0',
        marginBottom: '1rem'
      }}>
        <h2 style={{
          textAlign: 'center',
          fontSize: '2rem',
          fontWeight: '700',
          marginBottom: '2rem',
          fontFamily: 'var(--font-heading)',
          color: 'var(--color-bg)'
        }}>{row.title}</h2>
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
            padding: '0 1rem'
          }}>
            {row.items.map((item, i) => (
              <div key={i} className="card" style={{
                textAlign: 'center',
                height: 'auto',
                background: 'var(--color-card)',
                border: `1px solid var(--color-border)`,
                borderRadius: 'var(--radius)',
                boxShadow: 'var(--shadow)'
              }}>
                <div style={{ padding: '1.5rem' }}>
                  <img
                    src={item.image}
                    alt=""
                    style={{
                      width: '200px',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '50%',
                      margin: '0 auto',
                      display: 'block'
                    }}
                  />
                </div>
                <div style={{ 
                  marginTop: '1rem',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  {item.brandLogos.map((logo, j) => (
                    <img 
                      key={j} 
                      src={logo} 
                      alt="" 
                      style={{
                        height: '32px',
                        objectFit: 'contain',
                        marginRight: '0.5rem'
                      }} 
                    />
                  ))}
                </div>
                <p style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: 'var(--color-accent)',
                  margin: '1rem 0'
                }}>
                  {item.discountText}
                </p>
                <p style={{
                  fontSize: '0.75rem',
                  color: 'var(--color-text)',
                  paddingBottom: '1rem',
                  opacity: 0.7
                }}>* T&C APPLY</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ))}
  </div>
);

export default SaleSection;
