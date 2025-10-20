'use client'

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { createClient } from '@/lib/supabase/client';

type ChartData = {
  name: string;
  pengunjung: number;
};

type TimeRange = 'weekly' | 'monthly' | 'yearly';

export default function AnalyticsChart() {
  const [timeRange, setTimeRange] = useState<TimeRange>('monthly');
  const [data, setData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const now = new Date();
      let startDate: Date;

      if (timeRange === 'weekly') startDate = new Date(now.setDate(now.getDate() - 7));
      else if (timeRange === 'monthly') startDate = new Date(now.setMonth(now.getMonth() - 1));
      else startDate = new Date(now.setFullYear(now.getFullYear() - 1));

      const { data: rawData, error } = await supabase
        .rpc('get_destination_popularity', { start_date: startDate.toISOString() });

      if (error) {
        console.error("Error fetching analytics data:", error);
        setData([]);
      } else {
        const formattedData = rawData.map((item: any) => ({
          name: item.destination_name,
          pengunjung: item.review_count,
        }));
        setData(formattedData);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [timeRange, supabase]);

  const title = useMemo(() => {
    if (timeRange === 'weekly') return 'Popularitas Destinasi (7 Hari Terakhir)';
    if (timeRange === 'monthly') return 'Popularitas Destinasi (30 Hari Terakhir)';
    return 'Popularitas Destinasi (1 Tahun Terakhir)';
  }, [timeRange]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900/90 text-white p-3 rounded-xl border border-white/10 shadow-md backdrop-blur-md"
        >
          <p className="font-medium text-sm mb-1">{label}</p>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span>Pengunjung: <strong>{payload[0].value}</strong></span>
          </div>
        </motion.div>
      );
    }
    return null;
  };

  const rangeButton = (range: TimeRange, label: string) => (
    <Button
      variant={timeRange === range ? 'default' : 'outline'}
      size="sm"
      onClick={() => setTimeRange(range)}
      className={`transition-all duration-200 ${timeRange === range ? 'shadow-sm scale-105' : 'opacity-80 hover:opacity-100'}`}
    >
      {label}
    </Button>
  );

  return (
    <Card className="lg:col-span-4 overflow-hidden border border-border/50 backdrop-blur-sm bg-gradient-to-b from-background to-muted/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-lg font-semibold tracking-tight">{title}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">Berdasarkan jumlah ulasan yang diterima.</CardDescription>
        </div>
        <div className="flex gap-2">
          {rangeButton('weekly', 'Mingguan')}
          {rangeButton('monthly', 'Bulanan')}
          {rangeButton('yearly', 'Tahunan')}
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-[320px] w-full">
          {isLoading ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <motion.div
                className="w-5 h-5 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin"
                transition={{ repeat: Infinity, ease: "linear", duration: 1 }}
              />
              <span className="ml-2 text-sm">Memuat data analitik...</span>
            </div>
          ) : data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 15, right: 30, left: 0, bottom: 15 }}>
                <defs>
                  <linearGradient id="colorLine" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f57c00" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#f57c00" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                  height={55}
                />
                <YAxis tick={{ fontSize: 12 }} domain={[0, 'auto']} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="pengunjung"
                  stroke="url(#colorLine)"
                  strokeWidth={3}
                  dot={{
                    r: 5,
                    fill: '#fff',
                    stroke: '#f57c00',
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 7,
                    fill: '#fff',
                    stroke: '#f57c00',
                    strokeWidth: 3,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Tidak ada data ulasan pada periode ini.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
