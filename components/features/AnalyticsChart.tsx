"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function AnalyticsChart({ data }: { data: { day: string; engagement: number }[] }) {
    if (!data.length) return null;
    return (
        <div className="border rounded-lg p-4 bg-white shadow-sm">
            <h3 className="font-semibold mb-3">Engagement by Day</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="engagement" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}