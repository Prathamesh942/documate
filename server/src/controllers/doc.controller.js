import { Document } from "../models/document.model.js";

const createDoc = async (req, res) => {
  const newDoc = await Document.create({
    title: "Untitled",
    content: {},
    creator: req.user._id,
  });

  if (!newDoc)
    return res.status(500).json({ message: "cannot create document" });
  return res.status(200).json({ message: "Document created", newDoc });
};

const getDocs = async (req, res) => {
  const docs = await Document.find({ creator: req.user._id });
  if (!docs) return res.status(404).json({ message: "Documents not found" });
  return res.status(200).json({ message: "", docs });
};
export { createDoc, getDocs };
