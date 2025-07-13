import {
  ChatGoogleGenerativeAI,
  GoogleGenerativeAIEmbeddings,
} from "@langchain/google-genai"

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GOOGLE_API_KEY!,
  model: "text-embedding-004",
})
export const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY!,
  model: "gemini-2.5-flash",
  temperature: 0.5,
})

export async function getEmbeddings(text: string): Promise<number[]> {
  try {
    const response = await embeddings.embedQuery(text)
    return response
  } catch (error) {
    console.log("error embedding", error)
    throw error
  }
}
