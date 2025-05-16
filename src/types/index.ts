
export type Upload = {
  id: string;
  createdAt: string;
  filename: string;
  status: "pending" | "processing" | "completed" | "failed";
  rowCount?: number;
  errorMessage?: string;
};

export type TradeData = {
  timestamp: string;
  symbol: string;
  side: "buy" | "sell";
  price: number;
  quantity: number;
};

export type Metric = {
  symbol: string;
  totalVolume: number;
  buyVolume: number;
  sellVolume: number;
  vwap: number;
  trades: number;
  minPrice: number;
  maxPrice: number;
};

export type WidgetType = 
  | "volumeBarChart" 
  | "vwapLineChart" 
  | "summaryTable" 
  | "tradePieChart";

export type Widget = {
  id: string;
  type: WidgetType;
  title: string;
  symbol?: string; // Optional for widgets that can filter by symbol
  x: number;
  y: number;
  w: number;
  h: number;
};

export type DashboardLayout = {
  id: string;
  name: string;
  uploadId?: string;
  widgets: Widget[];
};

export type UserPreferences = {
  id?: string;
  userId: string;
  theme: "dark" | "light";
  selectedSymbols: string[];
  defaultLayout: string; // ID of default layout
  layouts: DashboardLayout[];
};
