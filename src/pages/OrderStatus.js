import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './OrderStatus.css';

function OrderStatus() {
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // ดึงข้อมูลคำสั่งซื้อจาก localStorage
    const storedOrderDetails = localStorage.getItem("orderDetails");

    if (storedOrderDetails) {
      setOrderDetails(JSON.parse(storedOrderDetails)); // แปลงข้อมูล JSON จาก localStorage
      setLoading(false);
    } else {
      navigate("/"); // ถ้าไม่มีข้อมูลคำสั่งซื้อจะนำทางไปหน้าแรก
    }
  }, [navigate]);

  const orderStatusList = [
    { id: 1, status: "Pending", icon: "🛒", isActive: orderDetails?.status === "Pending" },
    { id: 2, status: "Processing", icon: "🚚", isActive: orderDetails?.status === "Processing" },
    { id: 3, status: "Shipped", icon: "🚢", isActive: orderDetails?.status === "Shipped" },
    { id: 4, status: "Delivered", icon: "✅", isActive: orderDetails?.status === "Delivered" },
  ];

  return (
    <div className="order-status-container">
      {loading ? (
        <p>กำลังโหลดข้อมูลคำสั่งซื้อ...</p>
      ) : (
        <div className="order-status">
          <h2>สถานะการสั่งซื้อของคุณ</h2>
          <div className="order-summary">
            <p><strong>รหัสคำสั่งซื้อ:</strong> {orderDetails.orderId}</p>
            <p><strong>ชื่อ:</strong> {orderDetails.name}</p>
            <p><strong>ที่อยู่:</strong> {orderDetails.address}</p>
            <p><strong>เบอร์โทรศัพท์:</strong> {orderDetails.phone}</p>
            <h3 className="order-shipping-status">สถานะการจัดส่ง: {orderDetails.status}</h3>
          </div>
          <div className="order-status-list">
            {orderStatusList.map((item) => (
              <div key={item.id} className={`status-item ${item.isActive ? "active" : ""}`}>
                <div className="status-icon">{item.icon}</div>
                <p>{item.status}</p>
              </div>
            ))}
          </div>
          <div className="order-action">
            <button className="btn-action">ติดตามคำสั่งซื้อ</button>
            <button className="btn-action" onClick={() => navigate("/")}>ย้อนกลับ</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderStatus;
