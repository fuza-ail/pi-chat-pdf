import prisma from "@/lib/prisma"
import { NextRequest } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    if (!id) return new Response("Missing id", { status: 400 })
    const message = await prisma.message.findMany({
      where: {
        chatId: id,
      },
    })
    if (!message) {
      return new Response("Message not found", { status: 404 })
    }
    return new Response(JSON.stringify(message), { status: 200 })
  } catch (error) {
    console.log("error fetching message", error)
    return new Response("Error fetching message", { status: 500 })
  }
}
