import { Badge } from "@/components/ui/badge"
import { Document } from "@prisma/client"
import { format } from "date-fns"
import { FileText } from "lucide-react"
import Link from "next/link"

const MAX_FILENAME_LENGTH = 15

export default function DocumentCard({ document }: { document: Document }) {
  function displayFileName(fileName: string) {
    if (fileName.length > MAX_FILENAME_LENGTH) {
      return fileName.slice(0, MAX_FILENAME_LENGTH) + "..."
    }
    return fileName
  }

  return (
    <Link
      href={`/dashboard/chat/${document.id}`}
      className="border-2 border-neutral-100 rounded-xl p-2 flex flex-col gap-4 hover:shadow-sm shadow-purple-500 transition-shadow ease-in-out duration-300"
    >
      <div className="flex justify-center items-center p-8 bg-neutral-100 rounded-lg relative">
        <FileText className="text-red-500" size={100} />
      </div>
      <div className="flex flex-col items-start gap-1">
        <p className="font-semibold text-sm">
          {displayFileName(document.fileName)}
        </p>

        <p className="text-muted-foreground text-sm">
          <span>Date: </span>
          {format(new Date(document.uploadedAt), "dd/MM/yyyy")}
        </p>

        <div className="flex w-full items-center justify-between">
          <p className="text-muted-foreground text-sm">
            {Math.floor(document.fileSize / 1024)} KB
          </p>
          <Badge className="self-end" variant="default">
            status
          </Badge>
        </div>
      </div>
    </Link>
  )
}
