"use client"
import { Inbox } from "lucide-react"
import { useDropzone } from "react-dropzone"

export default function FileUpload() {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      uploadFile(acceptedFiles[0])
    },
  })

  async function uploadFile(file: File) {
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div
      {...getRootProps()}
      className={`w-full border-dashed border-2 flex flex-col items-center justify-center rounded-xl bg-neutral-100 cursor-pointer py-4 hover:bg-neutral-100/60 transition-colors ease-in-out duration-300 ${
        isDragActive ? "bg-neutral-100/60" : ""
      }`}
    >
      <input {...getInputProps()} />
      <>
        <Inbox className="w-10 h-10 text-purple-400" />
        <p className="text-sm text-muted-foreground">Drop PDF Here</p>
      </>
    </div>
  )
}
