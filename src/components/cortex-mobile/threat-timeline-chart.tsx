"use client"

import { Line, LineChart, CartesianGrid, XAxis, Tooltip } from "recharts"
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

const chartData = [
  { date: "15 days ago", threats: 2 },
  { date: "12 days ago", threats: 1 },
  { date: "10 days ago", threats: 0 },
  { date: "7 days ago", threats: 1 },
  { date: "5 days ago", threats: 1 },
  { date: "3 days ago", threats: 1 },
  { date: "2 days ago", threats: 1 },
  { date: "1 day ago", threats: 1 },
]

const chartConfig = {
  threats: {
    label: "Threats",
    color: "hsl(var(--primary))",
  },
}

export function ThreatTimelineChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Threat Timeline</CardTitle>
        <CardDescription>Detected threats over the last 15 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <LineChart data={chartData}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
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
