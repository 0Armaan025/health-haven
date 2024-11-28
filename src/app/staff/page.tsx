"use client";
import React, { useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

type StaffMember = {
  email: string;
  name: string;
};

const StaffPage: React.FC = () => {
  const [staff, setStaff] = useState<StaffMember[]>([
    { email: "staff1@example.com", name: "John Doe" },
    { email: "staff2@example.com", name: "Jane Smith" },
  ]);
  const [newEmail, setNewEmail] = useState("");

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;

    // Add new staff with a placeholder name
    setStaff([...staff, { email: newEmail, name: "Fetching..." }]);

    // Clear the input field
    setNewEmail("");

    // Simulate fetching the name from Firebase
    setTimeout(() => {
      setStaff((prevStaff) =>
        prevStaff.map((member) =>
          member.email === newEmail
            ? { ...member, name: "Fetched Name" } // Replace with actual Firebase data
            : member
        )
      );
    }, 1000); // Simulated fetch delay
  };

  const handleRemoveStaff = (email: string) => {
    // Remove staff member by email
    setStaff(staff.filter((member) => member.email !== email));
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 px-4 py-8">
        <h3 className="text-3xl font-semibold mb-8 text-red-500 font-poppins">
          Hospital Staff
        </h3>

        {/* Add Staff Form */}
        <form
          onSubmit={handleAddStaff}
          className="w-full max-w-lg bg-gray-700 p-6 rounded-lg shadow-lg"
        >
          <h4 className="text-xl font-semibold mb-4 text-gray-100">
            Add Staff
          </h4>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Staff Email
              </label>
              <input
                type="email"
                id="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
                className="w-full p-3 rounded-md bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-gray-100 font-semibold rounded-md transition-all"
            >
              Add
            </button>
          </div>
        </form>

        {/* Staff List */}
        <div className="w-full max-w-3xl mt-12 bg-gray-700 p-6 rounded-lg shadow-lg mb-8">
          <h4 className="text-xl font-semibold mb-4 text-gray-100">
            Staff Members
          </h4>
          <ul>
            {staff.map((member, index) => (
              <li
                key={index}
                className="flex justify-between items-center py-2 border-b border-gray-600"
              >
                <div>
                  <span className="text-lg">{member.name}</span>
                  <span className="text-gray-400 block">{member.email}</span>
                </div>
                <button
                  onClick={() => handleRemoveStaff(member.email)}
                  className="text-red-500 hover:text-red-700 font-semibold transition-all"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default StaffPage;
