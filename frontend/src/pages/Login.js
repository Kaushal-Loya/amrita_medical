import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const Login = ({ setUser }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        window.history.pushState(null, "", window.location.href);
        window.addEventListener("popstate", handleBackButton);

        // Prevent scrolling
        document.body.style.overflow = "hidden";

        return () => {
            window.removeEventListener("popstate", handleBackButton);
            document.body.style.overflow = ""; // Reset scroll when unmounting
        };
    }, []);

    const handleBackButton = () => {
        window.history.pushState(null, "", window.location.href);
    };

    const handleLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/token/login/`, {
                username,
                password
            });

            const token = response.data.auth_token;
            if (!token) throw new Error("No token received");

            localStorage.setItem("token", token);

            const isAdmin = username.startsWith("admin_");
            const userData = { username, isAdmin };

            localStorage.setItem("user", JSON.stringify(userData));
            
            setUser(userData);
            
            await new Promise(resolve => setTimeout(resolve, 300));
            
            const destination = isAdmin ? "/home_admin" : "/home_non_admin";
            navigate(destination);

        } catch (error) {
            setError("Invalid username or password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-screen flex flex-col overflow-hidden">
            {/* Fixed Navbar */}
            <div className="bg-[#8b1c48] w-full h-20 py-4 flex justify-center items-center fixed top-0 left-0 right-0 z-80">
                {/* Navbar Content */}
            </div>

            {/* Floating Amrita Logo - Brought to Front */}
            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-60">
                <img 
                    width="300"
                    height="10"
                    decoding="async"
                    className="rounded-lg w-52 sm:w-72 shadow-xl shadow-gray-600"
                    src="/Amrita_logo2.png" 
                    alt="Amrita Vishwa Vidyapeetham Logo" 
                />
            </div>

            {/* Main Content - No Scrolling */}
            <div className="h-full flex flex-col justify-center items-center pt-[140px] relative overflow-hidden">
                {/* Background Image */}
                <div 
                    className="absolute inset-0 -z-10 w-full h-full"
                    style={{
                        backgroundImage: 'url(background.webp)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        opacity: 0.5,
                    }}
                ></div>

                {/* Login Form */}
                <div className="p-8 bg-white rounded-lg shadow-lg w-96 z-10">
                    <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
                    
                    <div className="flex flex-col space-y-4">
                        <input
                            type="text"
                            placeholder="Username"
                            className="border p-2 rounded-lg"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="border p-2 rounded-lg"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        
                        {error && <p className="text-red-600 text-sm">{error}</p>}

                        <button 
                            onClick={handleLogin} 
                            className="bg-[#8b1c48] text-white p-2 rounded-lg hover:bg-[#a52a58]"
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
