import mongoose, { Schema } from "mongoose";

const DocumentSchema = new Schema(
  {
    title: String,
    content: Object,
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Document = mongoose.model("Document", DocumentSchema);
