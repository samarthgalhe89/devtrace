"use client";

import { LanguageStat } from "@/lib/analytics";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Palette } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TooltipProps } from "recharts";

interface LanguageChartProps {
  data: LanguageStat[];
}

// Custom tooltips
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-surface border border-border px-4 py-3 rounded-xl shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: data.color }}
          />
          <span className="font-semibold text-foreground">{data.name}</span>
        </div>
        <p className="text-sm text-muted-foreground pl-5">
          {data.percentage}% of codebase
        </p>
      </div>
    );
  }
  return null;
};

export default function LanguageChart({ data }: LanguageChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="h-full min-h-[320px] flex items-center justify-center animate-fade-in border-border/50 bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50">
        <p className="text-muted-foreground text-sm">No language data available</p>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-full min-h-[320px] animate-fade-in border-border/50 bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50">
      <CardHeader className="p-6 pb-2 flex flex-col mb-4 space-y-0 shrink-0">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-accent" />
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Language Distribution
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col w-full flex-1 p-6 pt-0 gap-6 overflow-hidden">
        <div className="h-[220px] w-full shrink-0 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={95}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
                cornerRadius={10}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    className="hover:opacity-80 transition-opacity outline-none"
                  />
                ))}
              </Pie>
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                <tspan
                  x="50%"
                  dy="-0.2em"
                  className="text-4xl font-extrabold text-foreground"
                  fill="currentColor"
                >
                  {data.length}
                </tspan>
                <tspan
                  x="50%"
                  dy="1.5em"
                  className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase"
                  fill="currentColor"
                >
                  TOTAL SOURCES
                </tspan>
              </text>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col gap-3 overflow-y-auto pr-1">
          {data.map((lang, index) => (
            <div key={index} className="flex items-center justify-between text-sm group">
              <div className="flex items-center gap-3">
                <span 
                  className="w-3 h-3 rounded-full shadow-sm" 
                  style={{ backgroundColor: lang.color }} 
                />
                <span className="font-medium text-foreground">{lang.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground text-xs group-hover:text-foreground transition-colors">
                  {lang.value.toLocaleString()}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary/50 text-secondary-foreground min-w-[3rem] text-center">
                  {lang.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
