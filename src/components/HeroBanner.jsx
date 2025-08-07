import React from 'react';

const HeroBanner = () => (
  <section
    className="relative bg-cover bg-center h-96"
    style={{ backgroundImage: "url('/images/hero/ajio-big-sale.jpg')" }}
  >
    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-end pr-8">
      <div className="text-right text-white max-w-md space-y-4">
        <h1 className="text-4xl font-extrabold">AJIO BIG BOLD SALE</h1>
        <p className="text-xl">50–90% OFF on 4000+ Brands</p>
        <button className="bg-white text-gray-900 px-6 py-2 rounded font-semibold hover:bg-gray-100">
          Shop Now
        </button>
      </div>
    </div>
  </section>
);

export default HeroBanner;
