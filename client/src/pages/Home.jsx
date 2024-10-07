import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [documents, setDocuments] = useState([]);

  const getDocs = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!(user)) {
        navigate("/login");
        return;
      }
      const docs = await axios.get("/api/v1/user/docs");
      setDocuments(docs.data.docs);
    } catch (error) {
      if (error.status == 401) {
        navigate("/login");
      }
    }
  };

  const createDocument = async () => {
    const res = await axios.post("/api/v1/doc/create");
    navigate(`/doc/${res.data.newDoc._id}`);
  };

  console.log(documents);

  useEffect(() => {
    getDocs();
  }, []);

  const clearCookies = () => {
    const cookies = document.cookie.split(";");

    cookies.forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
    });

    console.log("All cookies have been cleared.");
  };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between">
          <h1 className="text-3xl font-bold text-gray-900">My Documents</h1>
          <button
            className=" font-semibold border bg-blue-400 rounded-xl p-2 text-white"
            onClick={async () => {
              const res = await axios.post("/api/v1/auth/logout");
              clearCookies();
              localStorage.removeItem("user");
              navigate("/login");
              console.log(res);
            }}
          >
            Log out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 px-4">
        <div className="mb-4">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            onClick={createDocument}
          >
            Create New Document
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              onClick={() => {
                navigate(`/doc/${doc._id}`);
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
