"use client"
import { cn } from "@/lib/utils"
import { Chat } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft, GripVertical } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "./ui/button"
import { ResizableHandle, ResizablePanel } from "./ui/resizable"
import { Skeleton } from "./ui/skeleton"

export default function ChatSidebar() {
  const { data, isLoading } = useQuery({
    queryKey: ["chats"],
    queryFn: async (): Promise<Chat[]> => {
      const res = await fetch("/api/chat")
      return res.json()
    },
  })
  const { id } = useParams()

  return (
    <>
      <ResizablePanel defaultSize={15} minSize={12}>
        <div className="h-full bg-neutral-800 text-neutral-100 flex flex-col items-center">
          <div className="p-4 w-full">
            <Link href="/dashboard" className="w-full">
              <Button className="w-full border-2 border-neutral-300 border-dotted cursor-pointer">
                <ArrowLeft className="w-4 h-4" />
                Upload PDF
              </Button>
            </Link>
          </div>

          <div className="p-4 w-full h-full flex-1 overflow-y-auto">
            {isLoading ? (
              <div>
                {Array.from({ length: 3 }, (_, i) => i).map((i) => (
                  <Skeleton
                    key={i}
                    className="w-full h-8 mb-2 bg-neutral-600"
                  />
                ))}
              </div>
            ) : (
              <div className="w-full flex flex-col gap-2">
                {data?.map((chat: Chat) => (
                  <Link
                    href={`/dashboard/chat/${chat.id}`}
                    key={chat.id}
                    className={cn(
                      `truncate p-2 w-full rounded-md hover:bg-neutral-700/40`,
                      {
                        "bg-neutral-700": chat.id === id,
                      }
                    )}
                  >
                    {chat.fileName}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </ResizablePanel>

      <div className="relative flex items-center">
        <ResizableHandle className="bg-neutral-100 w-1 h-full" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-neutral-100 p-1 rounded">
            <GripVertical className="w-3 h-3 text-neutral-600" />
          </div>
        </div>
      </div>
    </>
  )
}
