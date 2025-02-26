import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css"; // ✅ Import ไฟล์ CSS

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/register", { 
        fullName, 
        email, 
        password, 
        phone, 
        address 
      });
      alert("ลงทะเบียนสำเร็จ!");
      navigate("/login");
    } catch (err) {
      alert("เกิดข้อผิดพลาดในการลงทะเบียน");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2 className="register-title">ลงทะเบียน</h2>
        <form onSubmit={handleRegister}>
          <div className="input-group">
            <label htmlFor="fullName">ชื่อ-นามสกุล</label>
            <input 
              type="text" 
              id="fullName" 
              placeholder="กรอกชื่อ-นามสกุล" 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
              required 
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">อีเมล</label>
            <input 
              type="email" 
              id="email" 
              placeholder="กรอกอีเมล" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">รหัสผ่าน</label>
            <input 
              type="password" 
              id="password" 
              placeholder="กรอกรหัสผ่าน" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <div className="input-group">
            <label htmlFor="phone">เบอร์โทรศัพท์</label>
            <input 
              type="text" 
              id="phone" 
              placeholder="กรอกเบอร์โทรศัพท์" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              required 
            />
          </div>
          <div className="input-group">
            <label htmlFor="address">ที่อยู่</label>
            <input 
              type="text" 
              id="address" 
              placeholder="กรอกที่อยู่" 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="register-button">ลงทะเบียน</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
