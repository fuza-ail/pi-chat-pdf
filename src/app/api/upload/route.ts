// pages/api/upload-supabase.ts or app/api/upload-supabase/route.ts (for App Router)

import prisma from "@/lib/prisma" // Assuming this path is correct for your Prisma client
import { supabase } from "@/lib/supabase" // Assuming this path is correct for your Supabase client
import { auth } from "@clerk/nextjs/server" // Import Clerk authentication utilities
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user with Clerk
    const { userId } = await auth() // Get the authenticated user's ID

    if (!userId) {
      // If no user is authenticated, return an unauthorized response
      return NextResponse.json(
        { message: "Unauthorized: No authenticated user." },
        { status: 401 }
      )
    }

    // Parse the form data from the request
    const formData = await request.formData()
    const file = formData.get("file")

    // Validate if a file was actually provided
    if (!file) {
      return NextResponse.json(
        { message: "No file provided." },
        { status: 400 }
      )
    }

    // Ensure 'file' is a Blob (or File) type before proceeding
    if (!(file instanceof Blob)) {
      return NextResponse.json(
        { message: "Invalid file type received." },
        { status: 400 }
      )
    }

    // Extract file details for Prisma
    const fileSize = file.size
    const mimeType = file.type

    // Generate a filename using timestamp and original name.
    // Note: While this approach avoids UUID, be aware of potential filename collisions
    // if multiple users upload files with the exact same original name at the exact same millisecond.
    const originalFilename = (file as File).name || "untitled"
    const fileName = `${Date.now()}-${originalFilename}`

    // Define the path in your Supabase Storage bucket
    // Files will be stored directly in the 'documents' bucket without a user-specific subfolder.
    const bucketName = "documents"

    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName) // Your bucket name
      .upload(fileName, file)

    if (error) {
      return NextResponse.json(
        { message: `File upload failed: ${error.message}` },
        { status: 500 }
      )
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName)

    const publicUrl = publicUrlData?.publicUrl

    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId, // Assuming your Prisma User model has a 'clerkId' field
      },
    })

    if (!user) {
      return NextResponse.json(
        { message: "User not found in database." },
        { status: 404 }
      )
    }

    // Save document metadata to Prisma
    await prisma.document.create({
      data: {
        fileName: fileName,
        fileSize: fileSize,
        mimeType: mimeType,
        fileUrl: publicUrl,
        userId: user.id,
      },
    })

    return NextResponse.json(
      {
        message: "File uploaded successfully",
        filePath: data?.path, // The path within the bucket
        publicUrl: publicUrl, // The public URL to access the file
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Unexpected error during file upload:", error)
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    )
  }
}

// You might also want to add a GET method for testing or other purposes
// export async function GET(request: NextRequest) {
//   return NextResponse.json({ message: "This is the file upload API route." });
// }
