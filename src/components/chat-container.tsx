"use client"
import { Message, MessageRole } from "@prisma/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Send } from "lucide-react"
import { useState } from "react"
import MessageList from "./message-list"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

export default function ChatContainer({
  fileName,
  chatId,
}: {
  fileName: string
  chatId: string
}) {
  const [message, setMessage] = useState<string>("")

  const queryClient = useQueryClient()
  const {
    data: messages = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["messages", chatId],
    queryFn: async (): Promise<Message[]> => {
      const res = await fetch(`/api/message/${chatId}`)
      if (!res.ok) {
        throw new Error("Upload failed")
      }
      return res.json()
    },
  })
  const mutation = useMutation({
    mutationFn: async () => {
      if (!message) return
      const res = await fetch("/api/message/send", {
        method: "POST",
        body: JSON.stringify({
          content: message,
          chatId,
          role: MessageRole.USER,
        }),
      })
      if (!res.ok) {
        throw new Error("Upload failed")
      }
      setMessage("")
      return await res.json()
    },
    onMutate: async ({
      content,
      chatId,
      role,
    }: {
      content: string
      chatId: string
      role: MessageRole
    }) => {
      await queryClient.cancelQueries({ queryKey: ["messages", chatId] })
      const previousMessages = queryClient.getQueryData([
        "messages",
        chatId,
      ]) as Message[] | undefined

      queryClient.setQueryData(
        ["messages", chatId],
        (old: Message[] | undefined) => {
          const optimisticMessage: Message = {
            id: "optimistic-" + Date.now(), // Temporary ID for optimistic update
            content: content,
            role: role,
            chatId: chatId,
            createdAt: new Date(), // Add a temporary date
            userId: "", // Placeholder, will be updated by actual response
            retrievedContext: "", // Add retrievedContext as it's part of Message type
          }
          return old ? [...old, optimisticMessage] : [optimisticMessage]
        }
      )
      return { previousMessages }
    },
    onSuccess: async (data) => {
      try {
        queryClient.invalidateQueries({ queryKey: ["messages", chatId] })
        const res = await fetch("/api/message/response", {
          method: "POST",
          body: JSON.stringify({
            message: data.content,
            fileName,
            chatId: data.chatId,
            userId: data.userId,
          }),
        })
        if (!res.ok) {
          throw new Error("Upload failed")
        }
        queryClient.invalidateQueries({ queryKey: ["messages", chatId] })
      } catch (error) {
        console.log("error", error)
      }
    },
  })
  if (error) {
    return <div>Error: {error.message}</div>
  }
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    mutation.mutate({ content: message, chatId, role: MessageRole.USER })
  }
  return (
    <div className="flex flex-col h-full">
      <div className="p-2 border-b-[1px] border-neutral-300/60 ">
        <h2 className="font-semibold text-xl">Chat</h2>
      </div>
      <MessageList
        messages={messages}
        isSending={mutation.isPending}
        isLoading={isLoading}
      />
      <form
        onSubmit={handleSubmit}
        className="p-4 flex items-center gap-2 border-t-[1px] border-neutral-300/60"
      >
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={mutation.isPending}
        />
        <Button
          className="self-start"
          type="submit"
          disabled={mutation.isPending}
        >
          <Send />
        </Button>
      </form>
    </div>
  )
}
