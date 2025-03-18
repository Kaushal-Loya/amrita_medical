import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";  // ✅ Import axios

const API_BASE_URL = "http://127.0.0.1:8000/api";

const HomeAdmin = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.isAdmin) {
      navigate("/login"); // Redirect to login if user is not authenticated
    }
  }, []);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
        // Call the logout API to invalidate the token on the backend
        await axios.post(`${API_BASE_URL}/auth/token/logout/`, {}, {
            headers: { Authorization: `Token ${localStorage.getItem("token")}` }
        });
    } catch (error) {
        console.error("Logout failed:", error.response?.data || error.message);
    }

    // Remove user details from local storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect to login
    navigate("/login");
};


  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navbar */}
      <nav className="bg-[#C8104D] text-white flex items-center justify-between px-6 py-3 shadow-md">
        {/* Left: Logo and Title */}
        <div className="flex items-center">
          <img src="/Amrita_logo.png" alt="Amrita Logo" className="h-10 mr-3" />
          <h1 className="text-2xl font-bold">Amrita Medical</h1>
        </div>

        {/* Right: Navigation Links */}
        <div className="flex items-center space-x-6">
          <a href="/people" className="text-white px-4 py-2 rounded-lg hover:bg-white hover:text-black">
            Records
          </a>
          <a href="/admin" className="text-white px-4 py-2 rounded-lg hover:bg-white hover:text-black">
            Admin Panel
          </a>

          {/* Profile Dropdown */}
          <div className="relative">
            <FaUserCircle
              className="text-3xl cursor-pointer hover:text-gray-300"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-gray-900 shadow-lg rounded-lg py-2">
                <button 
                  onClick={handleLogout} 
                  className="w-full text-left px-4 py-2 hover:bg-gray-200"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="flex flex-col items-center justify-center mt-10">
        <h1 className="text-4xl font-bold mb-4">Welcome to the College Medical Portal</h1>
        <p className="text-lg text-gray-700 mb-4">Your one-stop solution for accessing emergency medical information.</p>
        <p className="text-lg font-semibold text-red-600 mb-6">Admin Access: Manage and update records efficiently.</p>
      </div>
    </div>
  );
};

export default HomeAdmin;
