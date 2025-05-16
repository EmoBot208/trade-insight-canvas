
import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { metricsAPI } from "@/lib/api";
import { Widget, TradeData } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import WidgetHeader from "../dashboard/WidgetHeader";
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface VwapLineChartProps {
  widget: Widget;
  layoutId: string;
  uploadId: string;
}

export default function VwapLineChart({ widget, layoutId, uploadId }: VwapLineChartProps) {
  const chartRef = useRef<Chart<"line"> | null>(null);
  
  const { data: metrics, isLoading, error } = useQuery({
    queryKey: ["metrics", uploadId, widget.symbol],
    queryFn: () => metricsAPI.getByUploadId(uploadId),
    enabled: !!uploadId && !!widget.symbol,
  });

  // Filter metrics for the selected symbol
  const symbolMetric = widget.symbol ? metrics?.find(m => m.symbol === widget.symbol) : null;
  
  // Format data for Chart.js
  const chartData = {
    labels: ["VWAP"], // Simple one-point chart for now (In a real app, we'd have time-series data)
    datasets: [
      {
        label: widget.symbol || "Symbol",
        data: symbolMetric ? [symbolMetric.vwap] : [],
        borderColor: "hsl(var(--primary))",
        backgroundColor: "hsla(var(--primary), 0.5)",
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: "hsla(var(--muted), 0.2)",
        },
        ticks: {
          color: "hsl(var(--muted-foreground))",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "hsl(var(--muted-foreground))",
        },
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "hsl(var(--foreground))",
        },
      },
      tooltip: {
        backgroundColor: "hsl(var(--card))",
        titleColor: "hsl(var(--foreground))",
        bodyColor: "hsl(var(--foreground))",
        borderColor: "hsl(var(--border))",
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            return `VWAP: $${context.raw.toFixed(2)}`;
          },
        },
      },
    },
  };

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
        ) : symbolMetric ? (
          <div className="h-full w-full p-4">
            <Line data={chartData} options={chartOptions} />
          </div>
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <p className="text-muted-foreground text-sm">
              {widget.symbol ? `No data available for ${widget.symbol}` : "Please select a symbol"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
