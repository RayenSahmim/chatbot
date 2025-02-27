import {  NextRequest, NextResponse } from "next/server";
import { ChatSessionModel } from "@/models/ChatSession";
import connectDB from "@/lib/connectdb";
import { MessageModel } from "@/models/AiConverstation";
export async function POST(req : NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const {name , useremail} = body;
    // Create a new ChatSession with a reference to the AiConversation message
    const session = new ChatSessionModel({
      name,
      useremail,
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

export async function PATCH(req : NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, name } = body;
    // Find the session by ID
    const session = await ChatSessionModel.findById(id);
    if (!session) {
      return NextResponse.json({ error: "Session not found." }, { status: 404 });
    }
    // Update the session fields
    session.name = name;
    // Save the updated session
    await session.save();
    return NextResponse.json(session);
  } catch (error) {
    console.error("Error updating session:", error);
    return NextResponse.json(
      { error: "Failed to update session." },
      { status: 500 }
    );
  }
}


export async function DELETE(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const { id } = body;

        // Delete all related messages first
        await MessageModel.deleteMany({ sessionId: id });

        // Delete the session
        const deletedSession = await ChatSessionModel.findByIdAndDelete(id);
        
        if (!deletedSession) {
            return NextResponse.json({ error: "Session not found." }, { status: 404 });
        }

        return NextResponse.json({ 
            message: "Session and related messages deleted successfully.",
            sessionId: id
        });

    } catch (error) {
        console.error("Error deleting session:", error);
        return NextResponse.json(
            { error: "Failed to delete session." },
            { status: 500 }
        );
    }
}