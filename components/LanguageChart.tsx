"use client";

import { LanguageStat } from "@/lib/analytics";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Palette } from "lucide-react";

interface LanguageChartProps {
  data: LanguageStat[];
}

export default function LanguageChart({ data }: LanguageChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="glass-card p-6 h-[320px] flex items-center justify-center animate-fade-in">
        <p className="text-muted-foreground text-sm">No language data available</p>
      </div>
    );
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

  return (
    <div className="glass-card p-6 h-[320px] flex flex-col animate-fade-in">
      <div className="flex items-center gap-2 mb-2">
        <Palette className="w-5 h-5 text-accent" />
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Language Distribution
        </h3>
      </div>

      <div className="flex-1 w-full min-h-0 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              stroke="var(--color-card)"
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  className="hover:opacity-80 transition-opacity outline-none"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="middle"
              align="right"
              layout="vertical"
              iconType="circle"
              wrapperStyle={{
                fontSize: "12px",
                color: "var(--color-muted-foreground)",
                paddingLeft: "20px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
