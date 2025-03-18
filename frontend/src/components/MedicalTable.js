import React, { useEffect, useState } from 'react';
import { fetchMedicalData } from '../api';

const MedicalTable = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const getData = async () => {
            const records = await fetchMedicalData();
            setData(records);
        };
        getData();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold text-center mb-4">Medical Records</h2>
            <table className="w-full bg-white shadow-md rounded">
                <thead className="bg-blue-500 text-white">
                    <tr>
                        <th className="py-2 px-4">Name</th>
                        <th className="py-2 px-4">Category</th>
                        <th className="py-2 px-4">Age</th>
                        <th className="py-2 px-4">Blood Group</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((record, index) => (
                        <tr key={index} className="border-b text-center">
                            <td className="py-2 px-4">{record.name}</td>
                            <td className="py-2 px-4">{record.category}</td>
                            <td className="py-2 px-4">{record.age}</td>
                            <td className="py-2 px-4">{record.blood_group}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MedicalTable;
