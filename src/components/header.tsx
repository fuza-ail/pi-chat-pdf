import { Button } from "@/components/ui/button"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"

export default function Header() {
  return (
    <div className="fixed items-center justify-between flex w-full py-4 px-8 top-0 z-50 bg-white/20 backdrop-blur-sm border-b-[1px] border-neutral-300 h-[4rem]">
      <Link
        href="/"
        className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500"
      >
        Chat PDF
      </Link>

      <SignedOut>
        <SignInButton
          signUpFallbackRedirectUrl={"/dashboard"}
          signUpForceRedirectUrl={"/dashboard"}
          oauthFlow="popup"
          mode="modal"
        >
          <Button variant="outline" size="sm" className="cursor-pointer">
            <Image src="/icons/google.svg" width={16} height={16} alt="arrow" />
            <span className="font-semibold">Login with Google</span>
          </Button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  )
}
