"use client"
import { useMutation } from "@tanstack/react-query"
import { Send } from "lucide-react"
import { useState } from "react"
import MessageList from "./message-list"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

export default function ChatContainer({ fileName }: { fileName: string }) {
  const [message, setMessage] = useState<string>("")
  const mutation = useMutation({
    mutationFn: async () => {
      if (!message) return

      const res = await fetch("/api/message", {
        method: "POST",
        body: JSON.stringify({ message, fileName }),
      })
      if (!res.ok) {
        throw new Error("Upload failed")
      }
      return await res.json()
    },
    onSuccess: (data) => {
      setMessage("")
      console.log(data)
    },
  })

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    mutation.mutate()
  }
  return (
    <div className="flex flex-col h-full">
      <div className="p-2 border-b-[1px] border-neutral-300/60 ">
        <h2 className="font-semibold text-xl">Chat</h2>
      </div>
      <div className="p-4 flex-1 overflow-auto">
        <div className="flex flex-col gap-2">
          <MessageList />
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="p-4 flex items-center gap-2 border-t-[1px] border-neutral-300/60"
      >
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={mutation.isPending}
        />
        <Button className="self-start" type="submit">
          <Send />
        </Button>
      </form>
    </div>
  )
}
