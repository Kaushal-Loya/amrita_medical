import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ user }) => {
    const navigate = useNavigate();

    return (
        <nav className="bg-[#C8104D] text-white flex items-center justify-between px-6 py-3 shadow-md">
            {/* Left Side - Logo and Title */}
            <div className="flex items-center space-x-4">
                <img
                    src="/Amrita_logo.png" // Replace with the actual path to your logo
                    alt="Amrita Medical"
                    className="h-10"
                />
                <h1 className="text-lg font-bold">Amrita Medical</h1>
            </div>

            {/* Right Side - Buttons */}
            <div className="flex items-center space-x-4">
                <button
                    className="bg-white text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200"
                    onClick={() => navigate("/home_admin")}
                >
                    Home
                </button>

                {user?.isAdmin && (
                    <button
                        className=" text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700"
                        onClick={() => navigate("/people")}
                    >
                        Records
                    </button>
                )}

                {/* Profile Icon */}
                <div className="bg-white text-red-600 p-2 rounded-full cursor-pointer">
                    <span className="text-xl">👤</span>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
