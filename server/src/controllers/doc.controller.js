import { Document } from "../models/document.model.js";

const createDoc = async (req, res) => {
  const newDoc = await Document.create({
    title: "Untitled",
    content: [],
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

const getDoc = async (req, res) => {
  const id = req.params.id;
  console.log(id);

  const doc = await Document.findById(id);
  console.log(doc);

  if (!doc) return res.status(404).json({ message: "Document not found" });
  return res.status(200).json({ message: "", data: doc });
};

const updateDoc = async (req, res) => {
  const docId = req.params.id;
  const updatedDoc = req.body;

  console.log(updatedDoc);

  try {
    const document = await Document.findByIdAndUpdate(
      docId,
      {
        $set: {
          title: updatedDoc.title,
          content: updatedDoc.content,
        },
      },
      { new: true, runValidators: true } // Options: return the updated document and run validators
    );

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    res
      .status(200)
      .json({ message: "Document updated successfully", data: document });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export { createDoc, getDocs, getDoc, updateDoc };
