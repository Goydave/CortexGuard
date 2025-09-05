import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SecurityPage() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tighter">Security & 2FA</h1>
        <p className="text-muted-foreground">
          Manage your security settings.
        </p>
      </header>

      <Card>
        <CardHeader>
            <CardTitle>Two-Factor Authentication (2FA)</CardTitle>
            <CardDescription>This feature is not yet implemented.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground">
                In a real application, you could enable and manage two-factor authentication here to enhance your account security.
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
