import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

// Function to get token from local storage
const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Token ${token}` } : {};
};

// Fetch People
export const fetchPeople = async (filters = {}) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/people/`, {
            params: filters,
            headers: getAuthHeaders(),  // Add token
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching people:", error);
        return [];
    }
};

// Add a Person
export const addPerson = async (personData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/people/add/`, personData, {
            headers: getAuthHeaders(),  // Add token
        });
        return response.data;
    } catch (error) {
        console.error("Error adding person:", error.response?.data || error.message);
        throw error;
    }
};

// Delete a Person
export const deletePerson = async (id) => {
    try {
        await axios.delete(`${API_BASE_URL}/people/delete/${id}/`, {
            headers: getAuthHeaders(),  // Add token
        });
    } catch (error) {
        console.error("Error deleting person:", error.response?.data || error.message);
        throw error;
    }
};
