import mongoose, { Schema } from 'mongoose';

const MessageSchema: Schema = new Schema({
    _id: { type: String, required: true },
    sessionId: { type: String, required: true }, // Simple string
    content: { type: String, required: true },
    sender: { type: String, enum: ['user', 'bot'], required: true },
    timestamp: { type: Date, required: true },
});

// Check if the model already exists to prevent OverwriteModelError
const MessageModel = mongoose.models.AiConversation || mongoose.model('AiConversation', MessageSchema);

export { MessageModel };
