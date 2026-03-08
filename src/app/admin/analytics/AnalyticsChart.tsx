"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface DayData {
  date: string;
  page_views: number;
  listing_views: number;
  signups: number;
  offers: number;
}

export function AnalyticsChart({ data }: { data: DayData[] }) {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "13px" }}
          />
          <Legend wrapperStyle={{ fontSize: "13px" }} />
          <Area type="monotone" dataKey="page_views" name="Page Views" stroke="#1E88E5" fill="#1E88E5" fillOpacity={0.1} />
          <Area type="monotone" dataKey="listing_views" name="Listing Views" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
          <Area type="monotone" dataKey="signups" name="Signups" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} />
          <Area type="monotone" dataKey="offers" name="Offers" stroke="#f97316" fill="#f97316" fillOpacity={0.1} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
