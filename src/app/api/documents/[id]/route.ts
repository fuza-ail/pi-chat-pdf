import prisma from "@/lib/prisma"
import { NextRequest } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    if (!id) return new Response("Missing id", { status: 400 })

    const document = await prisma.document.findUnique({
      where: {
        id,
      },
      include: {
        chats: true,
      },
    })
    if (!document) {
      return new Response("Document not found", { status: 404 })
    }
    return new Response(JSON.stringify(document), { status: 200 })
  } catch (error) {
    console.error("Error fetching document:", error)
    return new Response("Error fetching document", { status: 500 })
  }
}
