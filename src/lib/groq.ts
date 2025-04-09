import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"

// Initialize the Groq client with your API key
export const groqModel = groq("llama3-70b-8192")

// Type definitions for clarity
type MessageToScore = {
  id: number
  message: string
}

type ScoredMessage = {
  id: number
  message: string
  score: number
}

// Function to batch score multiple messages at once
export async function batchScoreNeediness(messages: MessageToScore[]): Promise<ScoredMessage[]> {
  try {
    // Format messages for the prompt
    const formattedMessages = messages.map((m) => `ID: ${m.id}\nMessage: "${m.message}"`).join("\n\n")

    // Generate scores using Groq in a single API call
    const { text } = await generateText({
      model: groqModel,
      system: `
        You are an expert at evaluating donation requests. 
        Your task is to analyze multiple donation request messages and determine how genuinely needy each person appears to be.
        
        Score each message on a scale from 1 to 10 with up to 3 decimal places precision, where:
        - 1.000 means not needy at all or potentially fraudulent
        - 10.000 means extremely needy and deserving of immediate assistance
        
        IMPORTANT INSTRUCTIONS:
        1. Ensure each message gets a unique score - no two messages should have exactly the same score
        2. Use decimal precision (up to 3 decimal places) to differentiate between similar messages
        3. Return your evaluation in the following JSON format ONLY:
        [
          {"id": 123, "score": 7.432, "message": "original message text"},
          {"id": 456, "score": 8.921, "message": "original message text"}
        ]
        
        Do not include any explanations or additional text outside the JSON array.
      `,
      prompt: `Evaluate the following donation request messages and provide neediness scores (1-10 with up to 3 decimal places):\n\n${formattedMessages}`,
    })

    // Parse the JSON response
    try {
      const parsedScores = JSON.parse(text.trim()) as ScoredMessage[]
      return parsedScores
    } catch (parseError) {
      console.error("Error parsing Groq response:", parseError)
      // console.log("Raw response:", text)

      // Fallback: Return default scores if parsing fails
      return messages.map((msg, index) => ({
        id: msg.id,
        message: msg.message,
        score: 5 + index * 0.001, // Ensure unique scores even in fallback
      }))
    }
  } catch (error) {
    console.error("Error batch scoring messages:", error)

    // Return default scores on error
    return messages.map((msg, index) => ({
      id: msg.id,
      message: msg.message,
      score: 5 + index * 0.001, // Ensure unique scores even in error case
    }))
  }
}

// Keep the original function for backward compatibility or single-message scoring
export async function scoreNeediness(message: string): Promise<number> {
  try {
    const messages = [{ id: 0, message }]
    const scores = await batchScoreNeediness(messages)
    return scores[0]?.score || 5
  } catch (error) {
    console.error("Error scoring message:", error)
    return 5 // Default score on error
  }
}

