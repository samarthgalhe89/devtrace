"use client";

import { ActivityTimelinePoint } from "@/lib/activity";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TooltipProps } from "recharts";

interface ActivityChartProps {
  data: ActivityTimelinePoint[];
}

// Custom tooltips
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface border border-border px-4 py-3 rounded-xl shadow-xl backdrop-blur-md">
        <p className="text-sm text-muted-foreground mb-1">{label}</p>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-accent" />
          <span className="font-semibold text-foreground">
            {payload[0].value} {payload[0].value === 1 ? "repo" : "repos"} updated
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export default function ActivityChart({ data }: ActivityChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="h-full min-h-[320px] flex items-center justify-center animate-fade-in border-border/50 bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50">
        <p className="text-muted-foreground text-sm">No activity data available</p>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-full min-h-[320px] animate-fade-in border-border/50 bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50">
      <CardHeader className="p-6 pb-2 flex flex-col mb-4 space-y-0 shrink-0">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-accent" />
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Update Activity (Last 12 Mo)
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-1 w-full min-h-0 relative p-6 pt-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 0, left: -25, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorUpdates" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--color-border)"
              opacity={0.5}
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
              allowDecimals={false}
              dx={-5}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "var(--color-border)", strokeWidth: 1, strokeDasharray: "4 4" }} />
            <Area
              type="monotone"
              dataKey="updates"
              stroke="var(--color-accent)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorUpdates)"
              activeDot={{ r: 6, strokeWidth: 0, fill: "var(--color-accent)" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
