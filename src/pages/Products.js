import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Products.css';

function Products() {
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    // ตรวจสอบหากสินค้านี้มีอยู่ในตะกร้าแล้วจะเพิ่มปริมาณ
    const existingProductIndex = cart.findIndex(item => item.ProductID === product.ProductID);
    if (existingProductIndex >= 0) {
      cart[existingProductIndex].Quantity += 1; // เพิ่มจำนวนสินค้า
    } else {
      product.Quantity = 1; // หากสินค้าไม่อยู่ในตะกร้าให้เพิ่มจำนวนเป็น 1
      cart.push(product);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("เพิ่มสินค้าเรียบร้อยแล้ว");
  };

  useEffect(() => {
    if (!token) {
      alert("Unauthorized! Please login.");
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:5000/api/products", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => setProducts(res.data))
      .catch((err) => {
        alert("Unauthorized");
        navigate("/login");
      });
  }, [token, navigate]);

  return (
    <div className="products-container">
      <h2>FOOD</h2>
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.ProductID} className="product-card">
            <img
              src={`/img/${product.ImageURL}`} // รูปภาพที่อยู่ในโฟลเดอร์ public/img
              alt={product.ProductName}
              className="product-image"
            />
            <div className="product-info">
              <h3>{product.ProductName}</h3>
              <p>{product.Description}</p>
              <p className="product-price">฿{product.Price}</p>
              <button
                className="buy-btn"
                onClick={() => addToCart(product)} // เพิ่มสินค้าไปยังตะกร้า
              >
                BUY
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
