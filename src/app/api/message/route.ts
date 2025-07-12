import { getContext } from "@/lib/context"
import { llm } from "@/lib/gemini"
import { HumanMessage, SystemMessage } from "@langchain/core/messages"
import { MessageRole } from "@prisma/client"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { message, fileName } = body
    const context = await getContext(message, fileName)

    // Create messages array for LangChain
    const messages = [
      new SystemMessage(`
        Based on the provided context, respond to the user's query.
        
        Context:
        ${context}
        
        Rules:
        - Answer the user's query based on the context.
        - Use a conversational tone.
        - Answer the user's query in a friendly and engaging manner.
        - Be as informative as possible.
        - Provide relevant and accurate information based on the context.
        - You can provide links to relevant documents if necessary.
        - You can make inferences based on the context.
        - If the user's query is not in the context, say "I'm sorry, I don't have the answer to that question."
      `),
      new HumanMessage(message),
    ]

    // Invoke LangChain model with messages
    const response = await llm.invoke(messages)
    const content = response.content

    return Response.json(
      { message: content, role: MessageRole.SYSTEM },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error fetching document:", error)
    return new Response("Error fetching document", { status: 500 })
  }
}
