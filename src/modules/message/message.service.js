import { Message } from "../../DB/models/index.js";

export const sendMessage = async (receiverId, body, attachments = [], senderId) => {
  const message = new Message({
    content: body.content,
    attachment: attachments.map(file => file.finalPath),
    receiverId,
    senderId,
  });
  await message.save();
  return message;
};

export const getMessages = async (userId) => {
  const messages = await Message.find({ receiverId: userId }).populate('senderId', 'name email').sort({ createdAt: -1 });
  return messages;
};