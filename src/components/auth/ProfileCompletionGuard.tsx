"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Spinner } from "../ui/spinner";

export function ProfileCompletionGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profileComplete, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && user) {
      if (!profileComplete && pathname !== "/profile") {
        router.push("/profile");
      }
    }
  }, [user, profileComplete, loading, router, pathname]);

  if (loading || (!profileComplete && pathname !== "/profile")) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
