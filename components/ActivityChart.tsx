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
    const value = payload[0].value;
    
    // Dynamic creative text based on activity
    let subtitle = "";
    if (value === 0) subtitle = "Complete silence.";
    else if (value === 1) subtitle = "1 project got some love today.";
    else if (value < 4) subtitle = `${value} repos pushed forward.`;
    else subtitle = `${value} repos on fire! 🔥`;

    return (
      <div className="bg-[#1a1f2e]/95 border border-border/80 px-4 py-3 rounded-xl shadow-2xl shadow-black/50 backdrop-blur-md relative transform -translate-y-2">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-primary/5 rounded-xl pointer-events-none" />
        
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 flex items-center justify-between gap-4">
          <span>{label}</span>
          <Activity className="w-3 h-3 text-primary/70" />
        </p>
        
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(79,70,229,0.8)] animate-pulse" />
          <span className="font-bold text-sm text-foreground">
            {subtitle}
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
