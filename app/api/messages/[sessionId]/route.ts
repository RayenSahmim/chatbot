import { NextRequest, NextResponse } from "next/server";
import { MessageModel } from "@/models/AiConverstation"; // Ensure the path is correct
import connectDB from "@/lib/connectdb";

export async function GET(req: NextRequest, { params }: { params: { sessionId: string } }) {
  try {
    // Establish database connection
    await connectDB();

    // Extract sessionId from the route params
    const { sessionId } = await params;

    // Parse query parameters for offset and limit
    const { searchParams } = new URL(req.url);
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    // Validate sessionId
    if (!sessionId) {
      return NextResponse.json({ error: "sessionId is required." }, { status: 400 });
    }

    // Fetch messages for the given sessionId, sorted by timestamp
    const messages = await MessageModel.find({ sessionId })
   .sort({ timestamp: 1 })
   .skip(offset)
   .limit(limit)
   .lean()
   .exec();

    // Return the messages as a JSON response
    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages." },
      { status: 500 }
    );
  }
}
