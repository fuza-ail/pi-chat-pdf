import prisma from "@/lib/prisma"
import type { WebhookEvent } from "@clerk/nextjs/server"
import { headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { Webhook } from "svix"

const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET as string

export async function POST(req: NextRequest) {
  // Verify the webhook signature
  const headerPayload = await headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 })
  }

  const payload = await req.json()
  const body = JSON.stringify(payload)

  const wh = new Webhook(CLERK_WEBHOOK_SECRET)

  let evt: WebhookEvent
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error("Error verifying webhook:", err)
    return new Response("Invalid signature", { status: 400 })
  }

  // Handle the webhook event
  const { type, data } = evt

  try {
    switch (type) {
      case "user.created":
      case "user.updated":
        await prisma.user.upsert({
          where: {
            clerkId: data.id,
          },
          update: {
            email: data.email_addresses[0].email_address,
            name: `${data.first_name} ${data?.last_name}`,
          },
          create: {
            clerkId: data.id,
            email: data.email_addresses[0].email_address,
            name: `${data.first_name} ${data?.last_name}`,
          },
        })
        break

      case "user.deleted":
        await prisma.user.delete({
          where: {
            clerkId: data.id,
          },
        })
        break

      default:
        console.log(`Unhandled event type: ${type}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error handling ${type} event:`, error)
    return new Response("Internal server error", { status: 500 })
  }
}
