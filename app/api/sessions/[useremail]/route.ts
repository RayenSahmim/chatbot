import connectDB from "@/lib/connectdb";
import { ChatSessionModel } from "@/models/ChatSession";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ useremail: string }> }) {
    try {
        const useremail = (await params).useremail;

        await connectDB();

        if (!useremail) {
            return NextResponse.json({ error: "useremail is required." }, { status: 400 });
        }

        // Parse query parameters for limit and offset
        const url = new URL(req.url);
        const limit = parseInt(url.searchParams.get("limit") || "0", 10); // Default to 0 (no limit) if not provided
        const offset = parseInt(url.searchParams.get("offset") || "0", 10); // Default to 0 if not provided

        // Query the database with sorting, optional limit and offset
        const sessionsQuery = ChatSessionModel.find({ useremail })
            .sort({ createdAt: -1 }) // Sort by createdAt field in descending order (-1)
            .lean();

        if (limit > 0) {
            sessionsQuery.limit(limit);
        }

        if (offset > 0) {
            sessionsQuery.skip(offset);
        }

        const sessions = await sessionsQuery.exec();

        return NextResponse.json(sessions);
    } catch (error) {
        console.error("Error fetching sessions:", error);
        return NextResponse.json(
            { error: "Failed to fetch sessions." },
            { status: 500 }
        );
    }
}
