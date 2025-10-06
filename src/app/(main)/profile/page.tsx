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
          <CardTitle className="font-headline text-2xl">User Profile</CardTitle>
          <CardDescription>
            Complete your profile to get started. This information helps us
            tailor your experience.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm />
        </CardContent>
      </Card>
    </div>
  );
}
