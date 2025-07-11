"use client"

import { Document } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import DocumentCard from "./document-card"

export default function ListDocument() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["documents"],
    queryFn: async (): Promise<Document[]> => {
      const res = await fetch("/api/documents")
      return res.json()
    },
  })

  if (isError) return <div>Error</div>
  if (isLoading) return <div>Loading</div>

  return (
    <div className="flex w-full flex-wrap gap-4">
      {data?.map((document) => (
        <DocumentCard key={document.id} document={document} />
      ))}
    </div>
  )
}
