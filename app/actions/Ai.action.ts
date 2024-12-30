"use server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const sendAIResponse = async (prompt: string) => {
  const apikey = process.env.GEMINI_API_KEY;
  if (!apikey) {
    throw new Error("GEMINI_API_KEY is required");
  }

  try {
    const genAI = new GoogleGenerativeAI(apikey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "Hello" }],
        },
        {
          role: "model",
          parts: [{ text: "Great to meet you. What would you like to know?" }],
        },
      ],
    });

    const result = await chat.sendMessageStream(prompt);

    // Create a ReadableStream for streaming the response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            controller.enqueue(chunkText); // Send the chunk to the stream
          }
          controller.close(); // Close the stream when finished
        } catch (error) {
          controller.error(error); // Handle errors in the stream
        }
      },
    });

    return stream; // Return the stream to the caller
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch AI response.");
  }
};
