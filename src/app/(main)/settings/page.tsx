import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Bell, UserCircle, Shield, LogOut } from "lucide-react";

const settingsItems = [
  { label: "Profile", icon: UserCircle },
  { label: "Notifications", icon: Bell },
  { label: "Security & 2FA", icon: Shield },
  { label: "Log Out", icon: LogOut, color: "text-destructive" },
];

export default function SettingsPage() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tighter">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences.</p>
      </header>

      <Card>
        <CardContent className="p-0">
          <ul className="divide-y divide-border">
            {settingsItems.map((item) => (
              <li key={item.label}>
                <button className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <item.icon className={`w-6 h-6 text-muted-foreground ${item.color || ''}`} />
                    <span className={`font-medium ${item.color || ''}`}>{item.label}</span>
                  </div>
                  {item.label !== "Log Out" && <ChevronRight className="w-5 h-5 text-muted-foreground" />}
                </button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
