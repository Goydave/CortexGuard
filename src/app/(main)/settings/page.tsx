"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useScanHistory } from "@/hooks/use-scan-history";
import { useTheme } from "next-themes";
import { Bell, ChevronRight, LogOut, Moon, Sun, Shield, Trash2, UserCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const settingsItems = [
    { label: "Profile", icon: UserCircle, href: "/settings/profile" },
    { label: "Notifications", icon: Bell, href: "/settings/notifications" },
    { label: "Security & 2FA", icon: Shield, href: "/settings/security" },
];

export default function SettingsPage() {
    const { setTheme, theme } = useTheme();
    const { clearScans } = useScanHistory();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleClearHistory = () => {
        clearScans();
    };
    
  return (
    <div className="p-4 md:p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tighter">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences.</p>
      </header>

      <Card>
        <CardHeader>
            <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent>
             <div className="flex items-center justify-between">
                <label htmlFor="theme-toggle" className="flex items-center gap-4 font-medium">
                    {mounted && (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) ? <Moon className="w-6 h-6 text-muted-foreground" /> : <Sun className="w-6 h-6 text-muted-foreground" />}
                    <span>Theme</span>
                </label>
                {mounted && (
                  <div className="flex gap-2">
                      <Button variant={theme === 'light' ? 'default' : 'secondary'} size="sm" onClick={() => setTheme('light')}>Light</Button>
                      <Button variant={theme === 'dark' ? 'default' : 'secondary'} size="sm" onClick={() => setTheme('dark')}>Dark</Button>
                      <Button variant={theme === 'system' ? 'default' : 'secondary'} size="sm" onClick={() => setTheme('system')}>System</Button>
                  </div>
                )}
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y divide-border">
            {settingsItems.map((item) => (
              <li key={item.label}>
                <Link href={item.href}>
                    <button className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                        <item.icon className="w-6 h-6 text-muted-foreground" />
                        <span className="font-medium">{item.label}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </button>
                </Link>
              </li>
            ))}
             <li>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <button className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors text-destructive">
                            <div className="flex items-center gap-4">
                                <LogOut className="w-6 h-6" />
                                <span className="font-medium">Log Out</span>
                            </div>
                        </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will clear all your local data, including your scan history. This action cannot be undone.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleClearHistory} className="bg-destructive hover:bg-destructive/90">Log Out</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
              </li>
          </ul>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
            <CardTitle>Data Management</CardTitle>
        </CardHeader>
        <CardContent>
             <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear Scan History
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete your scan history from this device's cache. This action cannot be undone.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearHistory} className="bg-destructive hover:bg-destructive/90">Clear History</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
