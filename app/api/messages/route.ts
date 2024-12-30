import {  NextResponse , NextRequest } from "next/server";
import {  MessageModel} from "@/models/AiConverstation";
import connectDB from "@/lib/connectdb";
export async function POST(req : NextRequest) {
  try {

    await connectDB();
    const body = await req.json();
    console.log('body', body);
    const { timestamp ,sessionId,content ,sender , _id } = body;
    console.log(typeof sessionId);
    // Create a new ChatSession with a reference to the AiConversation message
    const message = new MessageModel({
        _id ,
        sessionId ,
        content ,
        sender  ,
        timestamp ,
    });
    // Save the session
    await message.save();
    console.log('message', message);
    return NextResponse.json(message);
  } catch (error) {
    console.error("Error handling AI response:", error);
    return NextResponse.json(
      { error: "Failed to fetch AI response." },
      { status: 500 }
    );
  }
}

export async function PUT (req : NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { id , content } = body;
    const message = await MessageModel.findById(id);
    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }
    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }
    message.content = content;
    await message.save();
    return NextResponse.json(message);
  } catch (error) {
    console.error("Error updating message:", error);
    return NextResponse.json(
      { error: "Failed to update message." },
      { status: 500 }
    );
  }
}