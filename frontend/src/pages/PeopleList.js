import React, { useState, useEffect } from "react";
import { fetchPeople } from "../api";
import Navbar from "./NavBar";

const PeopleList = ({user}) => {
    const [people, setPeople] = useState([]);
    const [filteredPeople, setFilteredPeople] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        loadPeople();
    }, []);

    useEffect(() => {
        filterPeople();
    }, [searchTerm, people]);

    const loadPeople = async () => {
        try {
            setIsLoading(true);
            const data = await fetchPeople();
            const sortedData = [...data].sort((a, b) => a.id - b.id);
            setPeople(sortedData);
            setFilteredPeople(sortedData);
        } catch (error) {
            console.error("Error fetching people:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filterPeople = () => {
        if (!searchTerm.trim()) {
            setFilteredPeople(people);
            return;
        }

        const term = searchTerm.toLowerCase();
        const filtered = people.filter(person => {
            return (
                String(person.id).includes(term) ||
                person.name.toLowerCase().includes(term) ||
                String(person.age).includes(term) ||
                person.blood_group.toLowerCase().includes(term) ||
                person.category.toLowerCase().includes(term) ||
                person.contact_info.toLowerCase().includes(term)
            );
        });
        setFilteredPeople(filtered);
    };

    const sortData = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });

        const sortedPeople = [...filteredPeople].sort((a, b) => {
            const valA = typeof a[key] === "string" ? a[key].toLowerCase() : a[key];
            const valB = typeof b[key] === "string" ? b[key].toLowerCase() : b[key];

            if (valA < valB) return direction === "asc" ? -1 : 1;
            if (valA > valB) return direction === "asc" ? 1 : -1;
            return 0;
        });
        setFilteredPeople(sortedPeople);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div>
            <Navbar user={user} />
            <div className="p-5 max-w-7xl mx-auto">
                <div className="flex flex-wrap items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold text-gray-800">People List</h1>
                    <div className="relative mt-2 sm:mt-0">
                        <input
                            type="text"
                            placeholder="Search by ID, name, age..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
                
                {isLoading && <div className="text-center py-4 text-gray-600">Loading...</div>}
                {!isLoading && filteredPeople.length === 0 && (
                    <div className="text-center py-4 text-gray-600">No results found</div>
                )}
                <div className="overflow-hidden rounded-lg shadow">
                    <table className="min-w-full divide-y divide-gray-400">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID
                                    <button onClick={() => sortData("id")} className="ml-2 px-2 py-1 rounded inline-flex items-center">
                                        {sortConfig.key === "id" ? (sortConfig.direction === "asc" ? "▲" : "▼") : "⇅"}
                                    </button>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                    <button onClick={() => sortData("name")} className="ml-2 px-2 py-1 rounded inline-flex items-center">
                                        {sortConfig.key === "name" ? (sortConfig.direction === "asc" ? "▲" : "▼") : "⇅"}
                                    </button>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Age
                                    <button onClick={() => sortData("age")} className="ml-2 px-2 py-1 rounded inline-flex items-center">
                                        {sortConfig.key === "age" ? (sortConfig.direction === "asc" ? "▲" : "▼") : "⇅"}
                                    </button>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Blood Group
                                    <button onClick={() => sortData("blood_group")} className="ml-2 px-2 py-1 rounded inline-flex items-center">
                                        {sortConfig.key === "blood_group" ? (sortConfig.direction === "asc" ? "▲" : "▼") : "⇅"}
                                    </button>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Category
                                    <button onClick={() => sortData("category")} className="ml-2 px-2 py-1 rounded inline-flex items-center">
                                        {sortConfig.key === "category" ? (sortConfig.direction === "asc" ? "▲" : "▼") : "⇅"}
                                    </button>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Contact
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredPeople.map((person) => (
                                <tr key={person.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">{String(person.id).padStart(3, '0')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{person.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{person.age}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{person.blood_group}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{person.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{person.contact_info}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PeopleList;