import {  NextRequest, NextResponse } from "next/server";
import { ChatSessionModel } from "@/models/ChatSession";
import connectDB from "@/lib/connectdb";
export async function POST(req : NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const {name} = body;
    // Create a new ChatSession with a reference to the AiConversation message
    const session = new ChatSessionModel({
      name,
      timestamp: new Date(),
    });
    // Save the session
    await session.save();
    return NextResponse.json(session);
  } catch (error) {
    console.error("Error handling AI response:", error);
    return NextResponse.json(
      { error: "Failed to fetch AI response." },
      { status: 500 }
    );
  }
}
export async function GET() {
  try {
    const sessions = await ChatSessionModel.find();
    return NextResponse.json(sessions);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch sessions." },
      { status: 500 }
    );
  }
}
