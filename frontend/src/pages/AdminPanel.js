import React, { useState, useEffect } from "react";
import { addPerson, deletePerson, fetchPeople } from "../api";
import Navbar from "./NavBar";

const AdminPanel = ({ user }) => {
    const [person, setPerson] = useState({
        name: "",
        age: "",
        blood_group: "",
        category: "",
        contact_info: "",
    });

    const [deleteId, setDeleteId] = useState("");
    const [people, setPeople] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        loadPeople();
    }, []);

    const loadPeople = async () => {
        try {
            setIsLoading(true);
            const data = await fetchPeople();
            setPeople(sortPeople(data, sortConfig)); // Apply sorting when loading
        } catch (error) {
            alert("Failed to fetch data");
            console.error("Error fetching people:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setPerson({ ...person, [e.target.name]: e.target.value.trim() });
    };

    const handleAdd = async () => {
        if (!Object.values(person).every((value) => value)) {
            alert("Please fill all fields!");
            return;
        }

        try {
            setIsLoading(true);
            const newPerson = await addPerson(person, user);
            if (newPerson && newPerson.id) {
                setPeople((prev) => sortPeople([...prev, newPerson], sortConfig));
                setPerson({ name: "", age: "", blood_group: "", category: "", contact_info: "" });
                alert("Person added successfully!");
            } else {
                alert("Failed to fetch new data. Refreshing list...");
                await loadPeople();
            }
        } catch (error) {
            alert("Failed to add person!");
            console.error("Error adding person:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) {
            alert("Please enter a valid ID!");
            return;
        }

        try {
            setIsLoading(true);
            await deletePerson(deleteId, user);
            setPeople((prev) => prev.filter((p) => p.id !== parseInt(deleteId, 10)));
            setDeleteId("");
            alert("Person deleted successfully!");
        } catch (error) {
            alert("Failed to delete person!");
            console.error("Error deleting person:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const sortPeople = (peopleArray, config) => {
        return [...peopleArray].sort((a, b) => {
            const valA = typeof a[config.key] === "string" ? a[config.key].toLowerCase() : a[config.key];
            const valB = typeof b[config.key] === "string" ? b[config.key].toLowerCase() : b[config.key];

            if (valA < valB) return config.direction === "asc" ? -1 : 1;
            if (valA > valB) return config.direction === "asc" ? 1 : -1;
            return 0;
        });
    };

    const sortData = (key) => {
        const direction = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
        setSortConfig({ key, direction });
        setPeople(sortPeople(people, { key, direction }));
    };

    return (
        <div>
            <Navbar user={user} />
            <div className="p-5 max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Admin Panel</h1>

                {/* Admin Controls - Add and Delete Side by Side */}
                {user?.isAdmin && (
                    <div className="flex gap-6 mb-8">
                        {/* Add Person Form */}
                        <div className="p-6 border rounded-lg bg-gray-50 shadow-sm w-1/2">
                            <h2 className="text-xl font-semibold mb-4 text-gray-700">Add Person</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <input 
                                    type="text" 
                                    name="name" 
                                    placeholder="Name" 
                                    value={person.name} 
                                    onChange={handleChange} 
                                    className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-300" 
                                />
                                <input 
                                    type="number" 
                                    name="age" 
                                    placeholder="Age" 
                                    value={person.age} 
                                    onChange={handleChange} 
                                    className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-300" 
                                />
                                <select 
                                    name="blood_group" 
                                    value={person.blood_group} 
                                    onChange={handleChange} 
                                    className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                >
                                    <option value="">Select Blood Group</option>
                                    {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
                                        <option key={bg} value={bg}>{bg}</option>
                                    ))}
                                </select>
                                <select 
                                    name="category" 
                                    value={person.category} 
                                    onChange={handleChange} 
                                    className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                >
                                    <option value="">Select Category</option>
                                    {["Student", "Faculty", "Staff"].map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                <input 
                                    type="text" 
                                    name="contact_info" 
                                    placeholder="Contact Info" 
                                    value={person.contact_info} 
                                    onChange={handleChange} 
                                    className="border rounded-md p-2 col-span-2 focus:outline-none focus:ring-2 focus:ring-blue-300" 
                                />
                            </div>
                            <button 
                                onClick={handleAdd} 
                                className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md p-2 mt-4 w-1/3 transition duration-200 ease-in-out" 
                                disabled={isLoading}
                            >
                                {isLoading ? "Adding..." : "Add Person"}
                            </button>
                        </div>

                        {/* Delete Person Section */}
                        <div className="p-6 border rounded-lg bg-gray-50 shadow-sm w-1/2">
                            <h2 className="text-xl font-semibold mb-4 text-gray-700">Delete Person</h2>
                            <div className="flex items-center gap-4">
                                <input 
                                    type="text" 
                                    placeholder="Enter Person ID" 
                                    value={deleteId} 
                                    onChange={(e) => setDeleteId(e.target.value)} 
                                    className="border rounded-md p-2 flex-grow focus:outline-none focus:ring-2 focus:ring-red-300" 
                                />
                                <button 
                                    onClick={handleDelete} 
                                    className="bg-red-500 hover:bg-red-600 text-white font-medium rounded-md p-2 px-6 transition duration-200 ease-in-out" 
                                    disabled={isLoading || !deleteId}
                                >
                                    {isLoading ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* People List */}
                <div className="mt-8">
                    <h1 className="text-2xl font-bold mb-4 text-gray-800">Records</h1>
                    {isLoading && <div className="text-center py-4 text-gray-600">Loading...</div>}
                    <div className="overflow-hidden rounded-lg shadow">
                        <table className="min-w-full divide-y divide-gray-400">
                            <thead className="bg-gray-200">
                                <tr>
                                    {["id", "name", "age", "blood_group", "category"].map((key) => (
                                        <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {key.toUpperCase()}
                                            <button onClick={() => sortData(key)} className="ml-2 px-2 py-1 rounded inline-flex items-center">
                                                {sortConfig.key === key ? (sortConfig.direction === "asc" ? "▲" : "▼") : "⇅"}
                                            </button>
                                        </th>
                                    ))}
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {people.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">{String(p.id).padStart(3, '0')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{p.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{p.age}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{p.blood_group}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{p.category}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{p.contact_info}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;