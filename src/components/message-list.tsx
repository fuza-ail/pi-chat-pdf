"use client"
import { Message, MessageRole } from "@prisma/client"
import clsx from "clsx"
import { useEffect } from "react"
export default function MessageList({
  messages,
  isLoading,
  isSending,
}: {
  messages: Message[]
  isLoading: boolean
  isSending: boolean
}) {
  useEffect(() => {
    const messageList = document.getElementById("message-list")
    if (messageList) {
      console.log(messageList.scrollHeight)
      messageList.scrollTo({
        top: messageList.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [messages, isLoading])

  return (
    <div
      id="message-list"
      className="flex flex-col gap-2 flex-1 p-4 overflow-auto"
    >
      {isLoading && <p>Loading...</p>}
      {messages.map((message) => (
        <div
          key={message.id}
          className={clsx(
            "text-sm p-2 rounded-lg",
            message.role === MessageRole.USER
              ? "self-end bg-neutral-100 "
              : "border-[1px] border-neutral-300 self-start"
          )}
        >
          {message.content}
        </div>
      ))}
      {isSending && (
        <div className="text-sm p-2 rounded-lg self-start border-[1px] border-neutral-300">
          Retrieving...
        </div>
      )}
    </div>
  )
}
