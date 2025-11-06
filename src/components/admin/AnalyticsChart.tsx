'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { createClient } from '@/lib/supabase/client'
import { Download } from 'lucide-react'
import { CSVLink } from 'react-csv'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type ChartData = {
  name: string
  value: number
}

type TimeRange = 'weekly' | 'monthly' | 'yearly'
type MetricType = 'reviews' | 'views'

export default function AnalyticsChart() {
  const [timeRange, setTimeRange] = useState<TimeRange>('monthly')
  const [metric, setMetric] = useState<MetricType>('reviews')
  const [data, setData] = useState<ChartData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()
  const csvLinkRef = useRef<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const now = new Date()
      let startDate: Date

      if (timeRange === 'weekly') startDate = new Date(now.setDate(now.getDate() - 7))
      else if (timeRange === 'monthly') startDate = new Date(now.setMonth(now.getMonth() - 1))
      else startDate = new Date(now.setFullYear(now.getFullYear() - 1))

      const rpcName = metric === 'reviews'
        ? 'get_destination_popularity'
        : 'get_destination_views'

      const valueKey = metric === 'reviews'
        ? 'review_count'
        : 'view_count'

      const { data: rawData, error } = await supabase.rpc(rpcName, {
        start_date: startDate.toISOString(),
      })

      if (error) {
        console.error(`Error fetching ${metric} data:`, error)
        setData([])
      } else {
        const formatted = rawData?.map((item: any) => ({
          name: item.destination_name,
          value: item[valueKey],
        })) ?? []
        setData(formatted)
      }

      setIsLoading(false)
    }

    fetchData()
  }, [timeRange, metric, supabase])

  const title = useMemo(() => {
    const prefix = metric === 'reviews' ? 'Popularitas (Ulasan)' : 'Kunjungan Halaman'
    if (timeRange === 'weekly') return `${prefix} - 7 Hari Terakhir`
    if (timeRange === 'monthly') return `${prefix} - 30 Hari Terakhir`
    return `${prefix} - 1 Tahun Terakhir`
  }, [timeRange, metric])

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
            <span>{metric === 'reviews' ? 'Ulasan' : 'Kunjungan'}: <strong>{payload[0].value}</strong></span>
          </div>
        </motion.div>
      )
    }
    return null
  }

  const handleExportCSV = () => {
    if (csvLinkRef.current) csvLinkRef.current.link.click()
  }

  const csvFileName = useMemo(
    () => `laporan_${metric}_${timeRange}_${new Date().toISOString().split('T')[0]}.csv`,
    [timeRange, metric]
  )

  return (
    <Card className="lg:col-span-4 overflow-hidden border border-border/50 backdrop-blur-sm bg-gradient-to-b from-background to-muted/20">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0 pb-4">
        <div>
          <CardTitle className="text-lg font-semibold tracking-tight">{title}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {metric === 'reviews'
              ? 'Berdasarkan jumlah ulasan yang diterima.'
              : 'Berdasarkan jumlah kunjungan halaman detail.'}
          </CardDescription>
        </div>

        <div className="flex flex-wrap justify-end gap-2 items-center">
          <Select value={metric} onValueChange={(v: MetricType) => setMetric(v)}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Pilih Metrik" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="reviews">Popularitas (Ulasan)</SelectItem>
              <SelectItem value="views">Kunjungan Halaman</SelectItem>
            </SelectContent>
          </Select>

          {(['weekly', 'monthly', 'yearly'] as TimeRange[]).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
            >
              {range === 'weekly' ? 'Mingguan' : range === 'monthly' ? 'Bulanan' : 'Tahunan'}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            disabled={isLoading || data.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Ekspor CSV
          </Button>
          <CSVLink
            data={data}
            headers={[
              { label: "Nama Destinasi", key: "name" },
              { label: metric === 'reviews' ? "Jumlah Ulasan" : "Jumlah Kunjungan", key: "value" },
            ]}
            filename={csvFileName}
            className="hidden"
            ref={csvLinkRef}
            target="_blank"
          />
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
                <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-35} textAnchor="end" interval={0} height={55} />
                <YAxis tick={{ fontSize: 12 }} domain={[0, 'auto']} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
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
              Tidak ada data pada periode ini.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
