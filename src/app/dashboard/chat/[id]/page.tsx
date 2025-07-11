"use client"
import ChatContainer from "@/components/chat-container"
import PdfViewer from "@/components/pdf-viewer"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useQuery } from "@tanstack/react-query"
import { GripVertical } from "lucide-react"
import { useParams } from "next/navigation"

export default function ChatDetail() {
  const { id } = useParams()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const { data, isLoading, isError } = useQuery({
    queryKey: ["chat"],
    queryFn: async () => {
      const res = await fetch(`/api/documents/${id}`)
      return await res.json()
    },
  })

  if (isError) return <div>Error</div>

  return (
    <div className="h-[calc(100vh-4rem)]">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={15} minSize={12}>
          <div className="h-full bg-neutral-800 text-neutral-100 p-2">
            Chat history{isMobile ? "yes" : "no"}
          </div>
        </ResizablePanel>

        {/* Resizable handle with icon */}
        <div className="relative flex items-center">
          <ResizableHandle className="bg-neutral-100 w-1 h-full" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-neutral-100 p-1 rounded">
              <GripVertical className="w-3 h-3 text-neutral-600" />
            </div>
          </div>
        </div>

        <ResizablePanel defaultSize={55} className="h-full" minSize={30}>
          <div className="h-full bg-neutral-50 p-4">
            {isLoading ? (
              <p>Loading..</p>
            ) : (
              <PdfViewer fileUrl={data.fileUrl} />
            )}
          </div>
        </ResizablePanel>

        {/* Second resizable handle with icon */}
        <div className="relative flex items-center">
          <ResizableHandle className="bg-neutral-100 w-1 h-full" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-neutral-100 p-1 rounded">
              <GripVertical className="w-3 h-3 text-neutral-600" />
            </div>
          </div>
        </div>

        <ResizablePanel defaultSize={30} minSize={20}>
          <ChatContainer />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
