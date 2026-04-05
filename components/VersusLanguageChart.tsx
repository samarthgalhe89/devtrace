"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LanguageStat } from "@/lib/analytics";

interface VersusLanguageChartProps {
  user1Name: string;
  user2Name: string;
  languages1: LanguageStat[];
  languages2: LanguageStat[];
}

export default function VersusLanguageChart({ user1Name, user2Name, languages1, languages2 }: VersusLanguageChartProps) {
  // Merge top 5 languages from both
  const topLangs = Array.from(new Set([
    ...(languages1?.slice(0, 5) || []).map(l => l.name),
    ...(languages2?.slice(0, 5) || []).map(l => l.name)
  ])).slice(0, 6);

  const chartData = topLangs.map(lang => {
    const l1 = (languages1 || []).find(l => l.name === lang);
    const l2 = (languages2 || []).find(l => l.name === lang);
    return {
      name: lang,
      [user1Name]: l1 ? l1.percentage : 0,
      [user2Name]: l2 ? l2.percentage : 0,
    };
  });

  return (
    <Card className="bg-card border-border shadow-sm mt-8 animate-fade-in relative z-0">
      <CardHeader className="p-6 border-b text-center">
        <CardTitle className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Language Head-to-Head</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(val) => `${val}%`} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: any) => [`${Number(value).toFixed(1)}%`]}
              />
              <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
              <Bar dataKey={user1Name} fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey={user2Name} fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
