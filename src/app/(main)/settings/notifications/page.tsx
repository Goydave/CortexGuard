import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotificationsPage() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tighter">Notifications</h1>
        <p className="text-muted-foreground">
          Manage your notification preferences.
        </p>
      </header>

      <Card>
        <CardHeader>
            <CardTitle>Push Notifications</CardTitle>
            <CardDescription>This feature is not yet implemented.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground">
                In a real application, you could toggle various notification settings here, such as new threat alerts or weekly summaries.
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
