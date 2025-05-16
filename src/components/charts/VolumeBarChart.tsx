
import { useQuery } from "@tanstack/react-query";
import { metricsAPI } from "@/lib/api";
import { Widget } from "@/types";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import WidgetHeader from "../dashboard/WidgetHeader";

interface VolumeBarChartProps {
  widget: Widget;
  layoutId: string;
  uploadId: string;
}

export default function VolumeBarChart({ widget, layoutId, uploadId }: VolumeBarChartProps) {
  const { data: metrics, isLoading, error } = useQuery({
    queryKey: ["metrics", uploadId],
    queryFn: () => metricsAPI.getByUploadId(uploadId),
    enabled: !!uploadId,
  });

  // Format data for the chart
  const chartData = metrics?.map(metric => ({
    symbol: metric.symbol,
    volume: metric.totalVolume,
  }));

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <WidgetHeader widget={widget} layoutId={layoutId} />
      <CardContent className="flex-1 p-0 overflow-hidden">
        {isLoading ? (
          <div className="h-full w-full flex items-center justify-center">
            <Skeleton className="h-4/5 w-4/5" />
          </div>
        ) : error ? (
          <div className="h-full w-full flex items-center justify-center">
            <p className="text-destructive text-sm">Error loading chart data.</p>
          </div>
        ) : chartData && chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <XAxis 
                dataKey="symbol" 
                angle={-45}
                textAnchor="end"
                height={60}
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                tickFormatter={value => 
                  value >= 1000000 
                    ? `${(value / 1000000).toFixed(1)}M` 
                    : value >= 1000 
                    ? `${(value / 1000).toFixed(1)}K` 
                    : value
                }
              />
              <Tooltip 
                formatter={(value: number) => value.toLocaleString()}
                contentStyle={{ 
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)"
                }}
              />
              <Bar dataKey="volume" fill="var(--primary)" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <p className="text-muted-foreground text-sm">No data available.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
