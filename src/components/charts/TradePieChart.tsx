
import { useQuery } from "@tanstack/react-query";
import { metricsAPI } from "@/lib/api";
import { Widget } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import WidgetHeader from "../dashboard/WidgetHeader";
import { VictoryPie, VictoryContainer, VictoryTooltip, VictoryLabel } from "victory";

interface TradePieChartProps {
  widget: Widget;
  layoutId: string;
  uploadId: string;
}

export default function TradePieChart({ widget, layoutId, uploadId }: TradePieChartProps) {
  const { data: metrics, isLoading, error } = useQuery({
    queryKey: ["metrics", uploadId, widget.symbol],
    queryFn: () => metricsAPI.getByUploadId(uploadId),
    enabled: !!uploadId && !!widget.symbol,
  });

  // Filter metrics for the selected symbol
  const symbolMetric = widget.symbol ? metrics?.find(m => m.symbol === widget.symbol) : null;
  
  // Prepare data for the pie chart
  const chartData = symbolMetric ? [
    { x: "Buy", y: symbolMetric.buyVolume, color: "var(--chart-green)" },
    { x: "Sell", y: symbolMetric.sellVolume, color: "var(--chart-red)" },
  ] : [];
  
  // Calculate percentages for labels
  const total = symbolMetric ? (symbolMetric.buyVolume + symbolMetric.sellVolume) : 0;
  const buyPercent = total > 0 ? Math.round((symbolMetric?.buyVolume || 0) / total * 100) : 0;
  const sellPercent = total > 0 ? Math.round((symbolMetric?.sellVolume || 0) / total * 100) : 0;

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <WidgetHeader widget={widget} layoutId={layoutId} />
      <CardContent className="flex-1 p-0 overflow-hidden">
        {isLoading ? (
          <div className="h-full w-full flex items-center justify-center">
            <Skeleton className="h-4/5 w-4/5 rounded-full" />
          </div>
        ) : error ? (
          <div className="h-full w-full flex items-center justify-center">
            <p className="text-destructive text-sm">Error loading chart data.</p>
          </div>
        ) : chartData.length > 0 ? (
          <div className="h-full w-full p-4 flex flex-col items-center justify-center">
            <VictoryPie
              data={chartData}
              colorScale={chartData.map(d => d.color)}
              padding={{ top: 30, bottom: 30, left: 30, right: 30 }}
              containerComponent={<VictoryContainer responsive={true} />}
              labels={({ datum }) => `${datum.x}: ${Math.round(datum.y)}}`}
              labelComponent={
                <VictoryTooltip
                  flyoutStyle={{
                    fill: "var(--card)",
                    stroke: "var(--border)",
                    strokeWidth: 1,
                  }}
                  style={{
                    fill: "var(--foreground)",
                  }}
                />
              }
              style={{
                labels: {
                  fill: "var(--foreground)",
                  fontSize: 12,
                },
              }}
            />
            
            <div className="flex justify-center gap-6 mt-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-chart-green mr-2"></div>
                <span className="text-sm">Buy ({buyPercent}%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-chart-red mr-2"></div>
                <span className="text-sm">Sell ({sellPercent}%)</span>
              </div>
            </div>
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
