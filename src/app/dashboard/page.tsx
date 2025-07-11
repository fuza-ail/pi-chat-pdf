import FileUpload from "@/components/file-upload"
import { Separator } from "@/components/ui/separator"
import ListDocument from "./_components/list-document"

export default function Dashboard() {
  return (
    <div className="flex items-center w-full">
      <div className="container flex flex-col items-center w-full gap-4 text-center">
        <h1 className="mt-20 text-2xl md:text-4xl font-semibold">
          Upload Your PDF&apos;s
        </h1>
        <p className="text-muted-foreground">
          Upload any PDF, ask questions, and get precise answers
        </p>
        <div className="border-2 p-2 rounded-xl w-full md:w-100">
          <FileUpload />
        </div>
        <Separator className="my-8" />
        <ListDocument />
      </div>
    </div>
  )
}
