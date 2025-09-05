import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCircle } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tighter">Profile</h1>
        <p className="text-muted-foreground">
          This is where your profile information would be displayed.
        </p>
      </header>

      <Card>
        <CardHeader>
          <UserCircle className="w-16 h-16 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-4">
            <div>
                <CardTitle>Anonymous User</CardTitle>
                <CardDescription>You are using the app anonymously.</CardDescription>
            </div>
            <p className="text-sm text-muted-foreground">
                In a real application, you could edit your name, email, and other profile settings here.
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
