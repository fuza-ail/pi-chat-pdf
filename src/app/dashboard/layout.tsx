"use client"
import ChatSidebar from "@/components/chat-sidebar"
import { ResizablePanelGroup } from "@/components/ui/resizable"
import { useMediaQuery } from "@/hooks/use-media-query"
import React from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isMobile = useMediaQuery("(max-width: 768px)")
  return (
    <div className="h-[calc(100vh-4rem)]">
      <ResizablePanelGroup
        direction={isMobile ? "vertical" : "horizontal"}
        className="h-full"
      >
        <ChatSidebar />
        {children}
      </ResizablePanelGroup>
    </div>
  )
}
