
import { Widget } from "@/types";
import VolumeBarChart from "../charts/VolumeBarChart";
import VwapLineChart from "../charts/VwapLineChart";
import SummaryTable from "../charts/SummaryTable";
import TradePieChart from "../charts/TradePieChart";

interface WidgetRendererProps {
  widget: Widget;
  layoutId: string;
  uploadId: string;
}

export default function WidgetRenderer({ widget, layoutId, uploadId }: WidgetRendererProps) {
  switch (widget.type) {
    case "volumeBarChart":
      return <VolumeBarChart widget={widget} layoutId={layoutId} uploadId={uploadId} />;
    case "vwapLineChart":
      return <VwapLineChart widget={widget} layoutId={layoutId} uploadId={uploadId} />;
    case "summaryTable":
      return <SummaryTable widget={widget} layoutId={layoutId} uploadId={uploadId} />;
    case "tradePieChart":
      return <TradePieChart widget={widget} layoutId={layoutId} uploadId={uploadId} />;
    default:
      return (
        <div className="p-4 h-full flex items-center justify-center text-muted-foreground">
          Unknown widget type
        </div>
      );
  }
}
