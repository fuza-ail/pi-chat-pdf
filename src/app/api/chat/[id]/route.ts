import { deleteNamespace } from "@/lib/pinecone"
import prisma from "@/lib/prisma"
import { supabase } from "@/lib/supabase"
import { NextRequest } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    if (!id) return new Response("Missing id", { status: 400 })

    const document = await prisma.chat.findUnique({
      where: {
        id,
      },
      include: {
        messages: true,
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    if (!id) return new Response("Missing id", { status: 400 })

    const document = await prisma.chat.delete({
      where: {
        id,
      },
    })
    await supabase.from("chats").delete().eq("id", id)
    await deleteNamespace(document.fileName)
    if (!document) {
      return new Response("Document not found", { status: 404 })
    }
    return new Response(JSON.stringify(document), { status: 200 })
  } catch (error) {
    console.error("Error deleting document:", error)
    return new Response("Error deleting document", { status: 500 })
  }
}
