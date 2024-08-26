import React, { useEffect, useState, useCallback } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";
import "./CustomQuill.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import debounce from "lodash/debounce";

const modules = {
  toolbar: [
    [{ font: [] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    ["link"],
    ["clean"],
  ],
};

const formats = [
  "font",
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "color",
  "background",
  "align",
  "link",
  "image",
];

const socket = io("http://localhost:3000");

const SingleDocument = () => {
  const navigate = useNavigate();
  const docId = useParams().id;

  const [value, setValue] = useState("");

  const handleContentChange = useCallback(
    debounce((content, delta, source, editor) => {
      setValue(editor.getContents());
      socket.emit("document-update", {
        roomId: docId,
        content: editor.getContents(),
      });
    }, 50),
    []
  );

  const saveDoc = async () => {
    console.log("saving");
    const res = await axios.put(`/api/v1/doc/update/${docId}`, {
      title: "untitled",
      content: value,
    });
    console.log(res);
  };

  useEffect(() => {
    const getDoc = async () => {
      try {
        const doc = await axios.get(`/api/v1/doc/${docId}`);
        setValue(doc.data.data.content);
      } catch (error) {
        console.log("error", error);
        if (error.status === 401) navigate("/login");
      }
    };
    getDoc();
  }, [socket]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
      socket.emit("joinRoom", { roomId: docId });

      socket.on("document-update", ({ content }) => {
        setValue(content);
      });
    });

    return () => {
      socket.disconnect();
      console.log("Socket disconnected");
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">{document.title}</h1>
          <p className="text-gray-500">
            Last modified: {document.lastModified}
          </p>
          <div className="flex">
            <button className="bg-blue-100 p-2 rounded-lg" onClick={saveDoc}>
              Save
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white p-4 shadow-lg rounded-lg">
          <ReactQuill
            theme="snow"
            value={value}
            onChange={handleContentChange}
            modules={modules}
            formats={formats}
            className="quill"
          />
        </div>
      </main>
    </div>
  );
};

export default SingleDocument;
