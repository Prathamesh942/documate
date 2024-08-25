import { Document } from "../models/document.model.js";
import { ApiError } from "../utils/ApiError.js";

const createDoc = async (req, res) => {
  const newDoc = await Document.create({
    title: "Untitled",
    content: {},
    creator: req.user._id,
  });

  if (!newDoc) throw new ApiError(500, "Error creating document");
  return res.status(200).json({ message: "Document created", newDoc });
};

export { createDoc };
