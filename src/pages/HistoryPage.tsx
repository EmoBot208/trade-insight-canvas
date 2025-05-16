
import UploadTable from "@/components/history/UploadTable";

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Upload History</h1>
        <p className="text-muted-foreground">
          View and manage your uploaded trade data files.
        </p>
      </div>
      
      <UploadTable />
    </div>
  );
}
