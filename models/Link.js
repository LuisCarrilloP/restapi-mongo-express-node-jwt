import mongoose, { mongo } from "mongoose";

const { Schema } = mongoose

const linkSchema = new Schema({
  longLink: {
    type: String,
    required: true,
    trim: true
  },
  nanoLink: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  uid: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
})

export const Link = mongoose.model("Link", linkSchema)