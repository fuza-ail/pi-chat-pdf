"use client"

type Props = {
  fileUrl: string
}
export default function PdfViewer({ fileUrl }: Props) {
  return <iframe src={`${fileUrl}#view=FitH`} className="w-full h-full" />
}
