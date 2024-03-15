import { Schema, model } from "mongoose"
const ContactSchema = new Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
    unique: true
  },
  phone: {
    type: String,
    unique: true
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});

export const Contact = model("Contact", ContactSchema)