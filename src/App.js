import React, { useContext } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Orders from "./pages/Orders";
import OrderStatus from "./pages/OrderStatus";  // เพิ่ม import สำหรับ OrderStatus
import { AuthContext } from "./AuthContext";

function App() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="App">
            <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">
                        MyShop
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link active" to="/">
                                   HOME
                                </Link>
                            </li>
                            {user ? (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/products">
                                            Products
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/orders">
                                            Cart
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/order-status">
                                            Status
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <button onClick={handleLogout} className="btn btn-danger">
                                            <i className="fas fa-sign-out-alt"></i> Logout
                                        </button>
                                    </li>
                                    
                                </>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/login">
                                            <i className="fas fa-sign-in-alt"></i> Login
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/register">
                                            <i className="fas fa-user-plus"></i> Register
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={user ? <Products /> : <Login />} />
                <Route path="/orders" element={user ? <Orders /> : <Login />} />
                <Route path="/order-status" element={user ? <OrderStatus /> : <Login />} /> {/* เพิ่มเส้นทางนี้ */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </div>
    );
}

export default App;
