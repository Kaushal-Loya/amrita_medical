import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import PeopleList from "./pages/PeopleList";
import AdminPanel from "./pages/AdminPanel";
import HomeAdmin from "./pages/Home_admin";
import HomeNonAdmin from "./pages/Home_non_admin";

function App() {
    const [user, setUser] = useState(() => {
        // Load user from localStorage if available
        const savedUser = localStorage.getItem("user");
        console.log("Initial user state from localStorage: ",savedUser);
        return savedUser ? JSON.parse(savedUser) : null;
    });

    useEffect(() => {
        console.log("User state updated:", user);
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);


    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login setUser={setUser} />} />
                <Route path="/people" element={<PeopleList />} />
                <Route path="/login" element={<Login setUser={setUser}/>} />
                <Route 
                    path="/home_admin" 
                    element={user && user.isAdmin ? <HomeAdmin /> : <Navigate to="/home_non_admin" />} 
                />
                <Route 
                    path="/home_non_admin"
                    element={
                        (() => {
                            const localUser = localStorage.getItem("user");
                            console.log("When rendering home_non_admin route:", { 
                                userState: user, 
                                localStorage: localUser,
                                parsedLocalStorage: localUser ? JSON.parse(localUser) : null
                            });
                            return (user || localUser) ? <HomeNonAdmin /> : (
                                console.log("Redirecting to login because no user found"),
                                <Navigate to="/login" />
                            );
                        })()
                    } 
                />
                <Route 
                    path="/admin" 
                    element={user && user.isAdmin ? <AdminPanel user={user} /> : <Navigate to="/people" />} 
                />
            </Routes>
        </Router>
    );
}

export default App;
