"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Inbox, Loader } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"

export default function FileUpload() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      if (!res.ok) {
        throw new Error("Upload failed")
      }
      return await res.json()
    },
    onSuccess: () => {
      // Invalidate and refetch the chats query to update the sidebar
      toast.success("File uploaded successfully")
      queryClient.invalidateQueries({ queryKey: ["chats"] })
    },
    onError: (error) => {
      console.error("Upload failed:", error)
      // You might want to show a toast notification here
    },
  })

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      mutation.mutate(acceptedFiles[0])
    },
  })

  return (
    <div
      {...getRootProps()}
      className={`w-full h-full border-dashed border-2 flex flex-col items-center justify-center rounded-xl bg-neutral-100 cursor-pointer hover:bg-neutral-100/60 transition-colors ease-in-out duration-300 ${
        isDragActive ? "bg-neutral-100/60" : ""
      }`}
    >
      <input {...getInputProps()} disabled={mutation.isPending} />
      <>
        {mutation.isPending ? (
          <Loader className="w-10 h-10 animate-spin text-purple-400" />
        ) : (
          <Inbox className="w-10 h-10 text-purple-400" />
        )}
        <p className="text-sm text-muted-foreground">
          {mutation.isPending ? "Uploading..." : "Drop PDF Here"}
        </p>
      </>
    </div>
  )
}
