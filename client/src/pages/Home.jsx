import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const documents = [
    { id: 1, title: "Document 1", lastModified: "2024-08-20" },
    { id: 2, title: "Document 2", lastModified: "2024-08-18" },
    { id: 3, title: "Document 3", lastModified: "2024-08-15" },
  ];

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">My Documents</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="mb-4">
          <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
            Create New Document
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              onClick={() => {
                navigate("/doc/1");
              }}
            >
              <h2 className="text-xl font-semibold text-gray-800">
                {doc.title}
              </h2>
              <p className="text-gray-600">Last modified: {doc.lastModified}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
