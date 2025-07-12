// pages/api/documents.ts or app/api/documents/route.ts (for App Router)

import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const { userId: clerkUserId } = await auth() // Renamed to avoid conflict with user.id

    if (!clerkUserId) {
      return NextResponse.json(
        { message: "Unauthorized: No authenticated user." },
        { status: 401 }
      )
    }

    const userWithDocuments = await prisma.user.findUnique({
      where: {
        clerkId: clerkUserId,
      },
      include: {
        chats: {
          orderBy: {
            uploadedAt: "desc", // Order by most recently uploaded
          },
        },
      },
    })

    if (!userWithDocuments) {
      return NextResponse.json(
        { message: "User not found in database." },
        { status: 404 }
      )
    }

    const chats = userWithDocuments.chats

    return NextResponse.json(chats, { status: 200 })
  } catch (error) {
    console.error("Error fetching documents:", error)
    return NextResponse.json(
      { message: "An unexpected error occurred while fetching documents." },
      { status: 500 }
    )
  }
}
