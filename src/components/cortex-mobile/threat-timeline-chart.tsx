"use client"

import { Line, LineChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { Scan } from "@/lib/types"

const chartConfig = {
  threats: {
    label: "Threats",
    color: "hsl(var(--primary))",
  },
}

export function ThreatTimelineChart({ scans }: { scans: Scan[] }) {

  const processScansForChart = (scans: Scan[]) => {
    if (!scans || scans.length === 0) {
      // Return data for an empty state chart
      const today = new Date();
      return Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(today.getDate() - i * 2);
        return {
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          threats: 0,
        };
      }).reverse();
    }

    const sortedScans = [...scans].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const threatsByDay = sortedScans.reduce((acc, scan) => {
        if (scan.isPhishing) {
            const date = new Date(scan.date).toISOString().split('T')[0]; // YYYY-MM-DD
            acc[date] = (acc[date] || 0) + 1;
        }
        return acc;
    }, {} as Record<string, number>);

    const last15Days = Array.from({length: 15}, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
    }).reverse();

    const chartData = last15Days.map(dateStr => {
        const date = new Date(dateStr);
        return {
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            threats: threatsByDay[dateStr] || 0
        };
    });

    return chartData;
  }

  const chartData = processScansForChart(scans);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Threat Timeline</CardTitle>
        <CardDescription>Detected threats over the last 15 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="threats"
              type="monotone"
              stroke="var(--color-threats)"
              strokeWidth={3}
              dot={{
                fill: "var(--color-threats)",
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
