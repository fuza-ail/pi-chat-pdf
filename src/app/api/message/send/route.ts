import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth()
    const body = await request.json()
    const { content, chatId, role } = body
    if (!clerkId) return new Response("Unauthorized", { status: 401 })

    const user = await prisma.user.findUnique({
      where: {
        clerkId,
      },
    })

    if (!user) {
      return new Response("User not found", { status: 404 })
    }

    const message = await prisma.message.create({
      data: {
        content,
        role,
        chatId,
        userId: user.id,
      },
    })
    return new Response(JSON.stringify(message), { status: 200 })
  } catch (error) {
    console.log("error sending message", error)
    return new Response("Error fetching message", { status: 500 })
  }
}
