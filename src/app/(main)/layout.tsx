import Header from "@/components/layout/Header";
import { ProfileCompletionGuard } from "@/components/auth/ProfileCompletionGuard";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProfileCompletionGuard>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 container mx-auto p-4 md:p-8">
            {children}
        </main>
      </div>
    </ProfileCompletionGuard>
  );
}
