import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs"
import { ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Hero() {
  return (
    <div className="flex text-center flex-col items-center justify-center w-full gap-8 container">
      <div className="absolute inset-0 bg-[radial-gradient(125%_125%_at_50%_90%,#fff_40%,#7c3aed_100%)] -z-10"></div>
      <Badge
        variant="secondary"
        className="flex items-center gap-2  py-1 px-3 rounded-full mt-30"
      >
        <Image src={"/icons/stars.svg"} width={14} height={20} alt="star" />
        <p className="text-xs font-semibold">Powered by Advanced AI</p>
      </Badge>
      <h1 className="text-2xl md:text-5xl font-bold">
        Beyond Reading: Talk to Your PDFs for Deeper Insights
      </h1>
      <p className="text-md text-muted-foreground md:text-2xl">
        Upload any PDF, ask questions, and get precise answers powered by AI.
        Transform how you intereat with information.
      </p>
      <SignedOut>
        <SignInButton
          signUpFallbackRedirectUrl={"/dashboard"}
          signUpForceRedirectUrl={"/dashboard"}
          oauthFlow="popup"
          mode="modal"
        >
          <Button variant="default" size="lg" className="cursor-pointer">
            <Image src="/icons/google.svg" width={16} height={16} alt="arrow" />
            <span className="font-semibold">Login with Google</span>
          </Button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <Link href="/dashboard">
          <Button variant="default" size="lg" className="cursor-pointer">
            Go to Dashboard <ChevronRight size={16} />
          </Button>
        </Link>
      </SignedIn>

      <div className="mt-12">Showcase</div>
    </div>
  )
}
