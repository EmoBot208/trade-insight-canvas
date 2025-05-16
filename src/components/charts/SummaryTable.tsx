
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { metricsAPI } from "@/lib/api";
import { Widget, Metric } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import WidgetHeader from "../dashboard/WidgetHeader";

interface SummaryTableProps {
  widget: Widget;
  layoutId: string;
  uploadId: string;
}

export default function SummaryTable({ widget, layoutId, uploadId }: SummaryTableProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Metric;
    direction: "asc" | "desc";
  }>({
    key: "symbol",
    direction: "asc",
  });

  const { data: metrics, isLoading, error } = useQuery({
    queryKey: ["metrics", uploadId],
    queryFn: () => metricsAPI.getByUploadId(uploadId),
    enabled: !!uploadId,
  });

  const handleSort = (key: keyof Metric) => {
    setSortConfig({
      key,
      direction: 
        sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc",
    });
  };

  // Sort metrics based on current configuration
  const sortedMetrics = metrics
    ? [...metrics].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      })
    : [];

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <WidgetHeader widget={widget} layoutId={layoutId} />
      <CardContent className="flex-1 p-0 overflow-hidden">
        <div className="h-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:text-primary transition"
                  onClick={() => handleSort("symbol")}
                >
                  Symbol
                  {sortConfig.key === "symbol" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-primary transition text-right"
                  onClick={() => handleSort("totalVolume")}
                >
                  Volume
                  {sortConfig.key === "totalVolume" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-primary transition text-right"
                  onClick={() => handleSort("vwap")}
                >
                  VWAP
                  {sortConfig.key === "vwap" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-primary transition text-right"
                  onClick={() => handleSort("trades")}
                >
                  Trades
                  {sortConfig.key === "trades" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-primary transition text-right"
                  onClick={() => handleSort("minPrice")}
                >
                  Min Price
                  {sortConfig.key === "minPrice" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-primary transition text-right"
                  onClick={() => handleSort("maxPrice")}
                >
                  Max Price
                  {sortConfig.key === "maxPrice" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-destructive">
                    Error loading data.
                  </TableCell>
                </TableRow>
              ) : sortedMetrics.length ? (
                sortedMetrics.map((metric) => (
                  <TableRow key={metric.symbol}>
                    <TableCell className="font-medium">{metric.symbol}</TableCell>
                    <TableCell className="text-right">{metric.totalVolume.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${metric.vwap.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{metric.trades.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${metric.minPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${metric.maxPrice.toFixed(2)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No data available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
