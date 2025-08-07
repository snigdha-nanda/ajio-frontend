import React from 'react';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import Carousel from '../components/Carousel';
import SaleSection from '../components/SaleSection';
import TopBrands from '../components/TopBrands';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="hero">
        <h1>Welcome to AJIO Clone</h1>
        <div className="subtitle">Shop the best styles here!</div>
      </div>

      {/* Search Bar Section */}
      <div className="container my-4">
        <SearchBar />
      </div>

      {/* Carousel Section */}
      <div className="container" style={{ maxWidth: 1200, margin: '0 auto', marginBottom: '2rem' }}>
        <Carousel />
      </div>

      {/* Sale Section */}
      <SaleSection />

      {/* Top Brands Section */}
      <TopBrands />

      <Footer />
    </>
  );
};

export default Home;
