"use server";
import { formatHistory } from "@/lib/utils";
import { Message } from "@/types";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { intelligentPrompt } from "@/lib/promts";
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};
export const sendAIResponse = async (prompt: string , history : Message []) => {
  const apikey = process.env.GEMINI_API_KEY;
  if (!apikey) {
    throw new Error("GEMINI_API_KEY is required");
  }

  try {
    const genAI = new GoogleGenerativeAI(apikey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const chat = model.startChat({
      generationConfig,
      history: formatHistory(history),
    });

    const result = await chat.sendMessageStream([prompt , intelligentPrompt]);

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
