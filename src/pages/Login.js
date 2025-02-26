import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // ✅ Import ไฟล์ CSS

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/login", { 
                email, 
                password 
            });

            if (response.status === 200) {
                const { token } = response.data;
                localStorage.setItem("token", token);
                login(token);
                navigate("/"); 
            }
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Try again.");
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="login-title">LOGIN</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label htmlFor="email">EMAIL</label>
                        <input 
                            type="email" 
                            id="email" 
                            placeholder="ENTER YOUR EMAIL" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">PASSWORD</label>
                        <input 
                            type="password" 
                            id="password" 
                            placeholder="ENTER YOUR PASSWORD" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" className="login-button">LOGIN</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
