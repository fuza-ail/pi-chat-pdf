import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Hero() {
  return (
    <div className="flex text-center flex-col items-center justify-center w-full gap-8 container">
      <div className="flex items-center gap-2 bg-slate-200 py-1 px-3 rounded-full mt-30">
        <Image src={"/icons/stars.svg"} width={14} height={20} alt="star" />
        <p className="text-xs font-semibold">Powered by Advanced AI</p>
      </div>
      <h1 className="text-5xl font-bold">
        Beyond Reading: Talk to Your PDFs for Deeper Insights
      </h1>
      <p className="text-muted-foreground text-xl">
        Upload any PDF, ask questions, and get precise answers powered by AI.
        Transform how you intereat with information.
      </p>
      <Button variant="default" size="lg">
        <Image src="/icons/google.svg" width={16} height={16} alt="arrow" />
        <span className="font-semibold">Login with Google</span>
      </Button>
    </div>
  )
}
