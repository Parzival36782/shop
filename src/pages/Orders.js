import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Orders.css';  // เพิ่มไฟล์ CSS สำหรับตกแต่ง
import { jwtDecode } from 'jwt-decode';  // แก้ไขเป็น named import

function Orders() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [showPopup, setShowPopup] = useState(false); // เพิ่ม state สำหรับเปิด/ปิด popup
  const [paymentMethod, setPaymentMethod] = useState("credit-card"); // เก็บวิธีการชำระเงินที่เลือก
  const [products, setProducts] = useState([]); // เก็บข้อมูลสินค้า
  const navigate = useNavigate();

  // ฟังก์ชัน handlePaymentMethodChange
  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  // ดึงข้อมูลจาก localStorage หรือจาก JWT ใน headers
  const getCustomerFromLocalStorage = () => {
    const token = localStorage.getItem("token");  // ดึง token จาก localStorage
    if (!token) return null;

    // ดึงข้อมูลลูกค้าจาก JWT
    const decodedToken = jwtDecode(token);  // ใช้ library jwt-decode เพื่อแปลง token
    return decodedToken;
  };

  // ดึงข้อมูลจาก localStorage และคำนวณราคาทั้งหมด
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
    calculateTotal(storedCart); // คำนวณราคาทั้งหมด
    fetchProducts(); // ดึงข้อมูลสินค้าเมื่อเริ่มโหลดหน้า
  }, []);

  // ดึงข้อมูลสินค้า
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // ใส่ token ที่ได้รับจากการ login
        },
      });
      const data = await response.json();
      setProducts(data); // เก็บข้อมูลสินค้าใน state
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  // คำนวณยอดรวมทั้งหมด
  const calculateTotal = (cartItems) => {
    const totalAmount = cartItems.reduce((sum, item) => sum + item.Price * item.Quantity, 0);
    setTotal(totalAmount);
  };

  // ลบสินค้าออกจากตะกร้า
  const removeFromCart = (productID) => {
    const updatedCart = cart.filter(item => item.ProductID !== productID);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // อัพเดตตะกร้าใน localStorage
    calculateTotal(updatedCart); // คำนวณยอดรวมใหม่
  };

  // เปิด popup เมื่อคลิกชำระเงิน
  const handleCheckout = () => {
    setShowPopup(true);
  };

  // ปิด popup เมื่อคลิกปิด
  const closePopup = () => {
    setShowPopup(false);
  };

  // เมื่อยืนยันการชำระเงิน เก็บข้อมูลใน localStorage และนำทางไปที่ OrderStatus
  const confirmPayment = async () => {
    const customer = getCustomerFromLocalStorage();  // ดึงข้อมูลลูกค้าจาก token
    if (!customer) return alert("กรุณาล็อกอินก่อนทำการชำระเงิน");
  
    const orderData = {
      customerID: customer.CustomerID, // ใช้ข้อมูลจาก JWT
      products: cart.map(item => ({
        ProductID: item.ProductID,
        Quantity: item.Quantity,
        Price: item.Price,
      })),
      totalPrice: total,
      shippingAddress: "ที่อยู่จัดส่ง",  // สามารถดึงจาก input ในฟอร์ม
      phone: "เบอร์โทรศัพท์",  // สามารถดึงจาก input ในฟอร์ม
      status: "Pending",  // ตั้งสถานะเริ่มต้นเป็น Pending
    };
  
    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(orderData),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        // เก็บข้อมูลคำสั่งซื้อใน localStorage
        localStorage.setItem("orderDetails", JSON.stringify(result));
        navigate("/order-status");  // นำทางไปยังหน้า OrderStatus
      } else {
        alert(result.message || "เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ");
    }
  };  

  return (
    <div className="orders-container">
      <h2>ORDER</h2>
      <div className="orders-list">
        {cart.length === 0 ? (
          <p>YOUR ORDER IS EMPTY</p>
        ) : (
          <ul>
            {cart.map((item) => {
              const product = products.find(p => p.ProductID === item.ProductID);
              return (
                <li key={item.ProductID} className="order-item">
                  {/* <div className="order-image">
                    <img 
                      src={`http://localhost:5000/${product?.ImageURL}`} // รูปภาพสินค้า
                      alt={item.ProductName}
                      className="product-image"
                    />
                  </div> */}
                  <div className="order-image">
                  <img src={`/img/${product?.ImageURL}`}  // รูปภาพจะถูกดึงจาก public/img
                  alt={item.ProductName}
                  className="product-image"/>
                  </div>
                  <div className="order-details">
                    <div className="order-name">{item.ProductName}</div>
                    <div className="order-quantity">จำนวน: {item.Quantity}</div>
                    <div className="order-price">฿{item.Price * item.Quantity}</div>
                  </div>
                  <div className="remove-item">
                    <button onClick={() => removeFromCart(item.ProductID)} className="remove-btn">
                      DELETE
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div className="order-summary">
        <h3>ยอดรวม: ฿{total}</h3>
        <button className="checkout-btn" onClick={handleCheckout}>ชำระเงิน</button>
      </div>

      {/* Popup สำหรับหน้าชำระเงิน */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>กรุณากรอกข้อมูลการชำระเงิน</h3>
            <form className="payment-form">
              <label>ชื่อ: </label>
              <input type="text" placeholder="กรอกชื่อของคุณ" required />
              
              <label>ที่อยู่: </label>
              <input type="text" placeholder="กรอกที่อยู่จัดส่ง" required />
              
              <label>เบอร์โทรศัพท์: </label>
              <input type="text" placeholder="กรอกเบอร์โทรศัพท์" required />

              {/* ช่องทางการชำระเงิน */}
              <div className="payment-method">
                <label>วิธีการชำระเงิน: </label>
                <div>
                  <input 
                    type="radio" 
                    id="credit-card" 
                    name="payment-method" 
                    value="credit-card" 
                    checked={paymentMethod === "credit-card"} 
                    onChange={handlePaymentMethodChange} 
                  />
                  <label htmlFor="credit-card">บัตรเครดิต</label>
                </div>
                <div>
                  <input 
                    type="radio" 
                    id="paypal" 
                    name="payment-method" 
                    value="paypal" 
                    checked={paymentMethod === "paypal"} 
                    onChange={handlePaymentMethodChange} 
                  />
                  <label htmlFor="paypal">PayPal</label>
                </div>
                <div>
                  <input 
                    type="radio" 
                    id="bank-transfer" 
                    name="payment-method" 
                    value="bank-transfer" 
                    checked={paymentMethod === "bank-transfer"} 
                    onChange={handlePaymentMethodChange} 
                  />
                  <label htmlFor="bank-transfer">การโอนเงินผ่านธนาคาร</label>
                </div>
              </div>

              <div className="popup-actions">
                <button type="button" className="confirm-btn" onClick={confirmPayment}>ยืนยันการชำระเงิน</button>
                <button type="button" className="cancel-btn" onClick={closePopup}>ยกเลิก</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;
