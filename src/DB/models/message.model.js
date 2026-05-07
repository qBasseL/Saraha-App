import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      minLength: 2,
      maxLength: 10000,
      required: function () {
        return !this.attachment?.length;
      },
    },
    attachment: {
      type: [String],
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    collection: "Message",
    timestamps: true,
  },
);

export const Message = mongoose.model("Message", messageSchema);