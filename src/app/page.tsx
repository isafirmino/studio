"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "@/components/ui/spinner";

export default function Home() {
  const { user, loading, profileComplete } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        if (!profileComplete) {
          router.push("/profile");
        } else {
          router.push("/dashboard");
        }
      } else {
        router.push("/login");
      }
    }
  }, [user, loading, profileComplete, router]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
      <Spinner className="h-10 w-10 text-primary drop-shadow-[0_0_8px_hsl(var(--primary))] animate-spin" />
      <p className="mt-4 text-muted-foreground">Carregando JuridicoDocs...</p>
    </div>
  );
}
