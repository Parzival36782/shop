import React from "react";
import { Link } from "react-router-dom";
import img1 from "../img/homepic1.jpg";
import img2 from "../img/homepic2.jpg";
import '../styles/home.css';

function Home() {
  return (
    <div>
      <h1>Welcome to MyShop</h1>
      <p>EATS EVERYTHING YOU WANT!</p>

      {/* Carousel */}
      <div id="carouselExample" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src={img1} className="d-block w-100 rounded-3 carousel-img" alt="Slide 1" />
          </div>
          <div className="carousel-item">
            <img src={img2} className="d-block w-100 rounded-3 carousel-img" alt="Slide 2" />
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

      {/* Navigation Links */}
      <center>
        <div className="mt-4">
          <nav>
            <Link to="/products" className="btn btn-primary me-2">View Products</Link>
            <Link to="/orders" className="btn btn-secondary me-2">My Orders</Link>
            <Link to="/login" className="btn btn-outline-primary me-2">Login</Link>
            <Link to="/register" className="btn btn-outline-secondary">Register</Link>
          </nav>
        </div>
      </center>
    </div>
  );
}

export default Home;