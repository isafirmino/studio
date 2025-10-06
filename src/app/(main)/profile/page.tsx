import ProfileForm from "@/components/profile/ProfileForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-2xl">
      <Card className="bg-card border-border shadow-lg shadow-primary/10">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Perfil de Usuário</CardTitle>
          <CardDescription>
            Complete seu perfil para começar. Esta informação nos ajuda
            a personalizar sua experiência.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm />
        </CardContent>
      </Card>
    </div>
  );
}
