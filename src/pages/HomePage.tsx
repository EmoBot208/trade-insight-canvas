
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, LayoutDashboard, History } from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-3">Trade Analysis Dashboard</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Upload your trading data, visualize performance metrics, and gain insights from your trading history.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-center p-2 bg-primary/10 w-12 h-12 rounded-lg mb-4">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Upload Data</CardTitle>
            <CardDescription>
              Upload your CSV trading data files for analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Import your trading data in CSV format. Our system will process your data and generate insights.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/upload">Upload CSV</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-center p-2 bg-primary/10 w-12 h-12 rounded-lg mb-4">
              <LayoutDashboard className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>View Dashboard</CardTitle>
            <CardDescription>
              Visualize your trading metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Access customizable dashboards with interactive charts and data visualizations to analyze your trading performance.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link to="/dashboard">Open Dashboard</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-center p-2 bg-primary/10 w-12 h-12 rounded-lg mb-4">
              <History className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Upload History</CardTitle>
            <CardDescription>
              Access your previously uploaded files
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              View your upload history, check processing status, and access previous analysis results.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link to="/history">View History</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-medium mb-4">Getting Started</h2>
        <ol className="space-y-4">
          <li className="flex gap-4">
            <div className="flex items-center justify-center p-2 bg-primary/10 w-8 h-8 rounded-full flex-shrink-0">
              <span className="text-primary font-medium">1</span>
            </div>
            <div>
              <h3 className="font-medium">Upload a CSV file</h3>
              <p className="text-muted-foreground text-sm">
                Start by uploading a CSV file containing your trade data. The file should include columns for timestamp, symbol, side, price, and quantity.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <div className="flex items-center justify-center p-2 bg-primary/10 w-8 h-8 rounded-full flex-shrink-0">
              <span className="text-primary font-medium">2</span>
            </div>
            <div>
              <h3 className="font-medium">Wait for processing</h3>
              <p className="text-muted-foreground text-sm">
                The system will process your data and calculate key metrics like volume weighted average price (VWAP) and trade statistics.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <div className="flex items-center justify-center p-2 bg-primary/10 w-8 h-8 rounded-full flex-shrink-0">
              <span className="text-primary font-medium">3</span>
            </div>
            <div>
              <h3 className="font-medium">Customize your dashboard</h3>
              <p className="text-muted-foreground text-sm">
                Add widgets to your dashboard to visualize different aspects of your trading data. Move and resize widgets to create a personalized view.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <div className="flex items-center justify-center p-2 bg-primary/10 w-8 h-8 rounded-full flex-shrink-0">
              <span className="text-primary font-medium">4</span>
            </div>
            <div>
              <h3 className="font-medium">Save and share</h3>
              <p className="text-muted-foreground text-sm">
                Save your dashboard layouts to quickly access them later. Your preferences are saved automatically.
              </p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  );
}
