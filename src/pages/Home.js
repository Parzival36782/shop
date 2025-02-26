import React from "react";
import { Link } from "react-router-dom";
import './Home.css';

function Home() {
  return (
    <div>
      <h1>Welcome to MyShop</h1>
      <p>EATS EVERYTHING YOU WANT!</p>

      {/* Carousel */}
      <div id="carouselExample" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="/img/homepic1.jpg" className="d-block w-100 rounded-3 carousel-img" alt="Slide 1" />
          </div>
          <div className="carousel-item">
            <img src="/img/homepic2.jpg" className="d-block w-100 rounded-3 carousel-img" alt="Slide 2" />
          </div>
        </div>
        {/* Controls */}
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      <div className="feature-links">
        <Link className="feature-link" to="/products">
         Products
        </Link> | 
        <Link className="feature-link" to="/orders">
         Orders
        </Link> | 
        <Link className="feature-link" to="/login">
         Login
        </Link> | 
        <Link className="feature-link" to="/register">
         Register
        </Link>
      </div>
    </div>
  );
}

export default Home;
