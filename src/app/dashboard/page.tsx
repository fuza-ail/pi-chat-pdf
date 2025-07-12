import FileUpload from "@/components/file-upload"
import { ResizablePanel } from "@/components/ui/resizable"

export default function Dashboard() {
  return (
    <ResizablePanel
      defaultSize={85}
      minSize={60}
      className="h-full grid place-items-center"
    >
      <div className="flex flex-col gap-8 text-center max-w-[60rem] items-center">
        <h1 className="text-4xl font-semibold">Chat with any PDF</h1>
        <p className="text-xl text-muted-foreground">
          Turn tedious PDFs into dynamic conversations. Ask questions, get
          instant summaries, and pinpoint information in seconds.
        </p>
        <div className="p-4 border-2 border-neutral-300/60 rounded-xl shadow-lg shadow-neutral-100/60 w-1/2 aspect-video">
          <FileUpload />
        </div>
      </div>
    </ResizablePanel>
  )
}
