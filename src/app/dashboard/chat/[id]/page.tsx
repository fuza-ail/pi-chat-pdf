"use client"
import ChatContainer from "@/components/chat-container"
import { Button } from "@/components/ui/button"
import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable"
import { Chat as ChatModel } from "@prisma/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { GripVertical, Loader, Trash } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"

export default function Chat() {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const router = useRouter()
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/chat/${id}`, {
        method: "DELETE",
      })
      if (!res.ok) {
        throw new Error("Upload failed")
      }
      return await res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] })
      router.push("/dashboard")
      toast.success("File deleted successfully")
    },
    onError: (error) => {
      console.error("Upload failed:", error)
    },
  })
  const { data, isLoading, isError } = useQuery({
    queryKey: ["chats", id],
    queryFn: async (): Promise<ChatModel> => {
      const res = await fetch(`/api/chat/${id}`)
      return res.json()
    },
  })

  if (isError) return <div>Error</div>

  return (
    <>
      <ResizablePanel defaultSize={55} className="h-full" minSize={30}>
        {isLoading ? (
          <p className="p-4">Loading...</p>
        ) : (
          <div className="h-full w-full flex flex-col">
            <div className="px-4 gap-4 py-2 border-b-[1px] border-neutral-300/60 flex flex-row justify-between items-center">
              <p className="font-semibold ">{data?.fileName}</p>
              <Button
                variant={"destructive"}
                size="icon"
                className="cursor-pointer"
                onClick={() => mutation.mutate()}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <Loader className="animate-spin" />
                ) : (
                  <Trash />
                )}
              </Button>
            </div>
            <iframe
              src={`${data?.fileUrl}#view=FitH`}
              className="w-full h-full"
            />
          </div>
        )}
      </ResizablePanel>

      <div className="relative flex items-center">
        <ResizableHandle className="bg-neutral-100 w-1 h-full" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-neutral-100 p-1 rounded">
            <GripVertical className="w-3 h-3 text-neutral-600" />
          </div>
        </div>
      </div>

      <ResizablePanel defaultSize={30} minSize={20}>
        <ChatContainer
          fileName={data?.fileName as string}
          chatId={id as string}
        />
      </ResizablePanel>
    </>
  )
}
