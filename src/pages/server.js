const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("../../database");

const app = express();
app.use(bodyParser.json());

// หรือกำหนด origin ที่อนุญาตเฉพาะ
app.use(cors({
  origin: "http://localhost:3000", // เปลี่ยนเป็นโดเมนของ frontend
  methods: ["GET", "POST", "PUT", "DELETE"], // กำหนด HTTP methods ที่อนุญาต
  allowedHeaders: ["Content-Type", "Authorization"], // กำหนด headers ที่อนุญาต
}));

const SECRET_KEY = "IT_lannapoly_cnx"; // ไม่ใช้ .env

// Middleware สำหรับตรวจสอบ JWT Token
const authenticate = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "❌ No Token Provided" });

  jwt.verify(token.split(" ")[1], SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ message: "❌ Unauthorized" });
    req.CustomerID = decoded.CustomerID;
    next();
  });
};

// ✅ Auth API
// 📌 **1. ลงทะเบียนลูกค้า**
app.post("/api/register", (req, res) => {
  const { fullName, email, password, phone, address} = req.body;
  const hashPassword = bcrypt.hashSync(password, 8);

  db.query("INSERT INTO Customer (FullName, Email, Password, Phone, Address) VALUES (?, ?, ?, ?, ?)", [fullName, email, hashPassword, phone, address], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Customer registered successfully" });
  });
});

// 📌 **2. Login**
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
  }

  db.query("SELECT * FROM Customer WHERE Email = ?", [email], (err, result) => {
      if (err) {
          return res.status(500).json({ message: "Database error", error: err });
      }

      if (result.length === 0) {
          return res.status(401).json({ message: "Invalid email or password" });
      }

      const user = result[0];
      const hashedPassword = user.Password;

      // ตรวจสอบว่ารหัสผ่านถูกต้องหรือไม่
      bcrypt.compare(password, hashedPassword, (err, isMatch) => {
          if (err || !isMatch) {
              return res.status(401).json({ message: "Invalid email or password" });
          }

          // สร้าง JWT Token
          const token = jwt.sign(
              { id: user.CustomerID, email: user.Email },
              SECRET_KEY,
              { expiresIn: "2h" }
          );

          res.json({ message: "Login successful", token });
      });
  });
});

// ✅ Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));