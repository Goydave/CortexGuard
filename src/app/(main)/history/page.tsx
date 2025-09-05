"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useScanHistory } from "@/hooks/use-scan-history";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Scan } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { AlertTriangle, CheckCircle, File, Link, Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

type FilterType = "all" | "safe" | "at_risk";

export default function HistoryPage() {
  const [filter, setFilter] = useState<FilterType>("all");
  const { scans } = useScanHistory();

  const filteredScans = scans.filter((scan) => {
    if (filter === "safe") return !scan.isPhishing;
    if (filter === "at_risk") return scan.isPhishing;
    return true;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getScanIcon = (type: Scan["type"]) => {
    switch (type) {
      case "URL": return <Link className="w-5 h-5" />;
      case "SMS": return <MessageSquare className="w-5 h-5" />;
      case "Email": return <Mail className="w-5 h-5" />;
      case "File": return <File className="w-5 h-5" />;
      default: return <Link className="w-5 h-5" />;
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tighter">Scan History</h1>
        <p className="text-muted-foreground">A log of all your past scans.</p>
      </header>

      <div className="flex gap-2">
        <Button variant={filter === 'all' ? 'default' : 'secondary'} onClick={() => setFilter('all')}>All</Button>
        <Button variant={filter === 'at_risk' ? 'default' : 'secondary'} onClick={() => setFilter('at_risk')}>At Risk</Button>
        <Button variant={filter === 'safe' ? 'default' : 'secondary'} onClick={() => setFilter('safe')}>Safe</Button>
      </div>

      <div className="space-y-4">
        {filteredScans.map((scan) => (
          <Card key={scan.id} className="bg-card/80">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={cn("p-2 rounded-full", scan.isPhishing ? "bg-destructive/20 text-destructive" : "bg-green-500/20 text-green-500")}>
                {scan.isPhishing ? <AlertTriangle className="w-6 h-6" /> : <CheckCircle className="w-6 h-6" />}
              </div>
              <div className="flex-1">
                <p className="font-semibold truncate">{scan.content}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {getScanIcon(scan.type)}
                    <span>{scan.type}</span>
                    &bull;
                    <span>{formatDistanceToNow(new Date(scan.date), { addSuffix: true })}</span>
                </div>
              </div>
              <Badge variant={scan.isPhishing ? "destructive" : "secondary"} className="hidden sm:inline-flex">
                {scan.riskScore}
              </Badge>
            </CardContent>
          </Card>
        ))}
        {filteredScans.length === 0 && (
            <div className="text-center py-10">
                <p className="text-muted-foreground">
                    {scans.length === 0 ? "Your scan history is empty." : "No scans match the current filter."}
                </p>
            </div>
        )}
      </div>
    </div>
  );
}
