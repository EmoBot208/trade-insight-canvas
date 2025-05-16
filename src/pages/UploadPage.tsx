
import UploadForm from "@/components/upload/UploadForm";

export default function UploadPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Upload Trade Data</h1>
        <p className="text-muted-foreground">
          Upload CSV files containing trade data for analysis.
        </p>
      </div>
      
      <div className="max-w-lg mx-auto">
        <UploadForm />
      </div>
      
      <div className="bg-card border rounded-lg p-6 max-w-2xl mx-auto mt-8">
        <h2 className="text-lg font-medium mb-4">CSV Format Guidelines</h2>
        
        <div className="space-y-4">
          <p>
            Your CSV file should contain the following columns:
          </p>
          
          <div className="overflow-x-auto border rounded-md">
            <table className="min-w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="py-2 px-4 text-left text-sm font-medium">Column</th>
                  <th className="py-2 px-4 text-left text-sm font-medium">Format</th>
                  <th className="py-2 px-4 text-left text-sm font-medium">Example</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-2 px-4 text-sm">timestamp</td>
                  <td className="py-2 px-4 text-sm">ISO date</td>
                  <td className="py-2 px-4 text-sm">2023-05-15T14:30:00Z</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-sm">symbol</td>
                  <td className="py-2 px-4 text-sm">String</td>
                  <td className="py-2 px-4 text-sm">AAPL</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-sm">side</td>
                  <td className="py-2 px-4 text-sm">"buy" or "sell"</td>
                  <td className="py-2 px-4 text-sm">buy</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-sm">price</td>
                  <td className="py-2 px-4 text-sm">Number</td>
                  <td className="py-2 px-4 text-sm">150.25</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-sm">quantity</td>
                  <td className="py-2 px-4 text-sm">Number</td>
                  <td className="py-2 px-4 text-sm">100</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Note: The CSV file should include a header row with these column names exactly as shown.
          </p>
          
          <div className="bg-muted p-3 rounded-md">
            <p className="text-xs font-mono text-muted-foreground">
              timestamp,symbol,side,price,quantity<br />
              2023-05-15T14:30:00Z,AAPL,buy,150.25,100<br />
              2023-05-15T14:35:22Z,MSFT,sell,290.75,50<br />
              2023-05-15T15:10:05Z,AAPL,sell,151.00,25
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
