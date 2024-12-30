import mongoose, { Schema } from 'mongoose';

const ChatSessionSchema: Schema = new Schema({
    timestamp: { type: Date, required: true },
    name: { type: String, required: true }
});

// Avoid overwriting the model if it already exists
const ChatSessionModel = mongoose.models.ChatSession || mongoose.model('ChatSession', ChatSessionSchema);

export { ChatSessionModel };
