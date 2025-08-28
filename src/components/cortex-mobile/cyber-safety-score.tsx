"use client";

import * as React from "react";
import { Label, Pie, PieChart, RadialBar, RadialBarChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
} from "@/components/ui/chart";

export function CyberSafetyScore({ score }: { score: number }) {
  const chartData = [{ name: "score", value: score, fill: "hsl(var(--primary))" }];

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Cyber Safety Score</CardTitle>
        <CardDescription>Your current security posture</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={{}}
          className="mx-auto aspect-square h-full max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={-270}
            endAngle={90}
            innerRadius={80}
            outerRadius={110}
            barSize={20}
          >
            <RadialBar
              background={{ fill: "hsl(var(--muted))" }}
              dataKey="value"
              cornerRadius={10}
            />
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-5xl font-bold"
                      >
                        {score.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground text-lg"
                      >
                        Score
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {score > 80
            ? "Excellent! Keep up the great work."
            : score > 60
            ? "Good, but there's room to improve."
            : "Your score is low. Check insights."}
        </div>
        <div className="leading-none text-muted-foreground text-center">
          Score is based on your recent scan activity and security habits.
        </div>
      </CardFooter>
    </Card>
  );
}
