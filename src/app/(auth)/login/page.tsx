"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Scale } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export default function LoginPage() {
  const { signInWithGoogle, user } = useAuth();
  const router = useRouter();
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    await signInWithGoogle();
    // The AuthProvider will handle redirection upon successful login
    // setIsSigningIn(false) might not be reached if redirect happens first
  };

  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-8 flex items-center gap-3">
        <Scale className="h-12 w-12 text-primary drop-shadow-[0_0_8px_hsl(var(--primary))]" />
        <h1 className="text-5xl font-bold tracking-tighter font-headline">
          JuridicoDocs
        </h1>
      </div>
      <p className="mb-8 max-w-md text-muted-foreground">
        Streamline your legal workflow with AI-powered document summarization and
        process management.
      </p>

      <Button
        onClick={handleSignIn}
        disabled={isSigningIn}
        size="lg"
        className="group bg-primary/90 hover:bg-primary text-lg transition-all duration-300 hover:shadow-[0_0_15px_hsl(var(--primary))]"
      >
        {isSigningIn ? (
          <Spinner className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <svg
            className="mr-2 h-5 w-5"
            aria-hidden="true"
            focusable="false"
            data-prefix="fab"
            data-icon="google"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 488 512"
          >
            <path
              fill="currentColor"
              d="M488 261.8C488 403.3 381.5 512 244 512 109.8 512 0 402.2 0 256S109.8 0 244 0c73.2 0 136 28.7 184.4 75.4l-73.6 72.4c-24.3-23.2-57.5-37.5-95.8-37.5-74.8 0-136.2 61.4-136.2 136.8s61.4 136.8 136.2 136.8c89.8 0 112.5-63.7 116.5-97.2H244v-90.2h244z"
            ></path>
          </svg>
        )}
        Sign in with Google
      </Button>
    </div>
  );
}
