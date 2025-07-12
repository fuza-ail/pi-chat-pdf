import { Send } from "lucide-react"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"

export default function ChatContainer() {
  return (
    <div className="flex flex-col h-full">
      <div className="p-2 border-b-[1px] border-neutral-300/60 ">
        <h2 className="font-semibold text-xl">Chat</h2>
      </div>
      <div className="p-4 flex-1 overflow-auto">
        <div className="flex flex-col gap-2">
          <p>Ask me Anything</p>
        </div>
      </div>
      <div className="p-4 flex items-center gap-2 border-t-[1px] border-neutral-300/60">
        <Textarea rows={1} />
        <Button className="self-start">
          <Send />
        </Button>
      </div>
    </div>
  )
}
