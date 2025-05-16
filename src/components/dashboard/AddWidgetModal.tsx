
import { useState } from "react";
import { useUserPrefs } from "@/contexts/UserPrefsContext";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { WidgetType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { metricsAPI } from "@/lib/api";
import { Check } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const widgetOptions = [
  { value: "volumeBarChart", label: "Volume Bar Chart", defaultTitle: "Volume by Symbol" },
  { value: "vwapLineChart", label: "VWAP Line Chart", defaultTitle: "VWAP Analysis" },
  { value: "summaryTable", label: "Summary Table", defaultTitle: "Trade Summary" },
  { value: "tradePieChart", label: "Buy/Sell Pie Chart", defaultTitle: "Buy vs Sell" },
];

const addWidgetSchema = z.object({
  type: z.enum(["volumeBarChart", "vwapLineChart", "summaryTable", "tradePieChart"] as const),
  title: z.string().min(1, "Widget title is required"),
  symbol: z.string().optional(),
});

type AddWidgetValues = z.infer<typeof addWidgetSchema>;

interface AddWidgetModalProps {
  layoutId: string;
  open: boolean;
  onClose: () => void;
}

export function AddWidgetModal({ layoutId, open, onClose }: AddWidgetModalProps) {
  const { addWidget, selectedLayout } = useUserPrefs();
  const [selectedType, setSelectedType] = useState<WidgetType | null>(null);
  const uploadId = selectedLayout.uploadId;

  // Fetch available symbols
  const { data: symbols = [] } = useQuery({
    queryKey: ["symbols", uploadId],
    queryFn: () => (uploadId ? metricsAPI.getSymbols(uploadId) : Promise.resolve([])),
    enabled: !!uploadId,
  });

  const form = useForm<AddWidgetValues>({
    resolver: zodResolver(addWidgetSchema),
    defaultValues: {
      title: "",
      type: "volumeBarChart",
    },
  });

  // Handle widget type selection
  const handleTypeSelect = (type: WidgetType) => {
    setSelectedType(type);
    const defaultTitle = widgetOptions.find(option => option.value === type)?.defaultTitle || "";
    form.setValue("type", type);
    form.setValue("title", defaultTitle);
  };

  const onSubmit = (values: AddWidgetValues) => {
    addWidget(layoutId, {
      type: values.type,
      title: values.title,
      symbol: values.symbol,
      // Default positioning - will be adjusted by grid layout
      x: 0,
      y: 0,
      w: 6,
      h: 3,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Widget</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-2 mb-4">
          {widgetOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={cn(
                "p-3 rounded-lg border text-left transition-all",
                selectedType === option.value
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              )}
              onClick={() => handleTypeSelect(option.value as WidgetType)}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{option.label}</span>
                {selectedType === option.value && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </div>
            </button>
          ))}
        </div>
        
        {selectedType && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Widget Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {(selectedType === "vwapLineChart" || selectedType === "tradePieChart") && (
                <FormField
                  control={form.control}
                  name="symbol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Symbol</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select symbol" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {symbols.map((symbol) => (
                            <SelectItem key={symbol} value={symbol}>
                              {symbol}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <DialogFooter>
                <Button type="submit">Add Widget</Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
