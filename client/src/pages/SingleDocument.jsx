import React, { useEffect, useState, useCallback, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";
import "./CustomQuill.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import debounce from "lodash/debounce";
import QuillCursors from "quill-cursors";

ReactQuill.Quill.register("modules/cursors", QuillCursors);

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
  cursors: {
    hideDelayMs: 5000,
  },
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

const cursorColors = [
  "red",
  "blue",
  "green",
  "yellow",
  "orange",
  "purple",
  "pink",
  "cyan",
  "magenta",
  "lime",
  "teal",
  "violet",
  "brown",
  "coral",
  "gold",
  "navy",
  "olive",
  "salmon",
  "indigo",
  "maroon",
  "turquoise",
  "plum",
  "orchid",
  "crimson",
  "chocolate",
];

const socket = io("https://documate-36bo.onrender.com");
// const socket = io("http://localhost:3000");

const SingleDocument = () => {
  const navigate = useNavigate();
  const docId = useParams().id;
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const quillRef = useRef(null);
  const [color, setColor] = useState(null);
  const [room, setRoom] = useState([]);
  const [saveButtonText, setSaveButtonText] = useState("Save");
  const [shareButtonText, setShareButtonText] = useState("Share");

  if (!color) {
    const randomColor =
      cursorColors[Math.floor(Math.random() * cursorColors.length)];
    setColor(randomColor);
  }

  const storedUser = JSON.parse(localStorage.getItem("user"));

  const handleContentChange = useCallback(
    debounce((content, delta, source, editor) => {
      if (source !== "user") return;
      console.log("'I'  changed content");

      setValue(editor.getContents());
      socket.emit("document-update", {
        roomId: docId,
        content: editor.getContents(),
      });
    }, 30),
    []
  );

  const handleSelectionChange = useCallback(
    (range) => {
      if (range) {
        console.log(range);
        const { index, length } = range;
        socket.emit("cursor-update", {
          roomId: docId,
          cursor: { index, length, user: storedUser.username },
        });
      }
    },
    [docId]
  );

  const saveDoc = async () => {
    console.log("saving");
    setSaveButtonText("saving");
    socket.emit("docSaved", { roomId: docId });
    const res = await axios.put(`/api/v1/doc/update/${docId}`, {
      title,
      content: value,
    });
    setSaveButtonText("Saved");
    setTimeout(() => {
      setSaveButtonText("Save");
    }, 500);
    console.log(res);
  };

  const handleShare = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(
      () => {
        setShareButtonText("Link Copied");
        setTimeout(() => {
          setShareButtonText("Share");
        }, 2000);
      },
      (err) => {
        console.error("Failed to copy: ", err);
      }
    );
  };

  const getDoc = async () => {
    try {
      if (!storedUser) {
        navigate("/login");
        return;
      }
      const doc = await axios.get(`/api/v1/doc/${docId}`);
      setTitle(doc.data.data.title);
      setValue(doc.data.data.content);
    } catch (error) {
      console.log("error", error);
      if (error.status == 401) {
        navigate("/login");
        return;
      }
    }
  };

  useEffect(() => {
    getDoc();
  }, [docId, navigate]);

  useEffect(() => {
    const handleSaveShortcut = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();
        saveDoc();
      }
    };

    document.addEventListener("keydown", handleSaveShortcut);

    return () => {
      document.removeEventListener("keydown", handleSaveShortcut);
    };
  }, []);

  useEffect(() => {
    const quill = quillRef.current.getEditor();
    const cursors = quill.getModule("cursors");

    socket.on("connect", () => {
      console.log("Connected to server");
      socket.emit("joinRoom", {
        roomId: docId,
        username: storedUser?.username,
      });

      console.log(color);

      // cursors.createCursor(storedUser.username, storedUser.username, "blue");
      // console.log("cursor for " + storedUser.username + "created");
      // cursors.createCursor("user1", "User 1", "red");
      // cursors.moveCursor("user1", { index: 5, length: 0 });

      socket.on("roomUsers", (room) => {
        setRoom(room);
      });

      socket.on("document-update", ({ content }) => {
        setValue(content);
        console.log(content);
      });

      socket.on("docSaved", async () => {
        await getDoc();
      });

      socket.on("cursor-update", ({ cursor }) => {
        console.log(cursor.index);
        const { index, length, user } = cursor;
        cursors.createCursor(user, user, color);
        cursors.moveCursor(user, { index, length });
        console.log(user + "s cursor moved to index " + index + " " + length);
      });
    });

    return () => {
      cursors.removeCursor(storedUser?.username);
      socket.disconnect({ roomId: docId, user: storedUser?.username });
      console.log("Socket disconnected");
    };
  }, [docId]);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="w-full md:w-auto flex items-center mb-4 md:mb-0">
            <Link to={"/"}>
              <img
                src="/logo.png"
                alt="Logo"
                className="h-10 min-w-10 md:h-10 md:w-10 mr-3 object-cover"
              />
            </Link>
            <input
              type="text"
              className="text-2xl max-md:text-center md:text-3xl font-bold text-gray-900 bg-transparent border-none outline-none focus:ring-0 w-full md:w-auto"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <button
              className="bg-blue-500 p-2 rounded-lg w-full md:w-auto text-white md:hidden max-w-20 mx-4 flex items-center gap-1 justify-center"
              onClick={handleShare}
            >
              {shareButtonText}
              <img className=" w-6 h-6" src="/link.png" alt="" />
            </button>
            <div className=" border rounded-full min-w-10 min-h-10 w-10 h-10 flex justify-center items-center bg-blue-500 text-white md:hidden">
              {storedUser?.username[0].toUpperCase()}
            </div>
          </div>

          <div className=" flex gap-5 items-center">
            <button onClick={saveDoc}>{saveButtonText}</button>
            <div className="w-full md:w-auto">
              {room.length > 1 && (
                <div className="flex space-x-2 justify-start md:justify-end border-2 rounded-md p-1">
                  {room
                    .filter((user) => storedUser.username != user)
                    .map((user, index) => (
                      <div
                        key={index}
                        className="relative w-8 h-8 md:w-10 md:h-10 flex justify-center items-center rounded-full bg-blue-400 text-white font-semibold cursor-pointer hover:bg-blue-500 transition-all duration-200"
                        title={user}
                        style={{ backgroundColor: user.color }}
                      >
                        {user[0].toUpperCase()}
                      </div>
                    ))}
                </div>
              )}
            </div>
            <button
              className="bg-blue-500 p-2 rounded-lg w-full md:w-auto text-white max-md:hidden flex justify-center items-center"
              onClick={handleShare}
            >
              {shareButtonText}
              <img className=" w-6 h-6" src="/link.png" alt="" />
            </button>
            <div className=" border rounded-full min-w-10 min-h-10 w-10 h-10 flex justify-center items-center bg-blue-500 text-white max-md:hidden">
              {storedUser?.username[0].toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white p-4 shadow-lg rounded-lg">
          <ReactQuill
            theme="snow"
            value={value}
            onChange={handleContentChange}
            onChangeSelection={handleSelectionChange}
            modules={modules}
            formats={formats}
            ref={quillRef}
            className="quill"
          />
        </div>
      </main>
    </div>
  );
};

export default SingleDocument;
