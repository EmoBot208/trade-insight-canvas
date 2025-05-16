
import { useState, useEffect } from "react";
import { Widget } from "@/types";
import { useUserPrefs } from "@/contexts/UserPrefsContext";
import { useQuery } from "@tanstack/react-query";
import { metricsAPI } from "@/lib/api";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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

interface WidgetSettingsModalProps {
  widget: Widget;
  layoutId: string;
  open: boolean;
  onClose: () => void;
}

const widgetSettingsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  symbol: z.string().optional(),
});

type WidgetSettingsValues = z.infer<typeof widgetSettingsSchema>;

export function WidgetSettingsModal({ widget, layoutId, open, onClose }: WidgetSettingsModalProps) {
  const { updateWidget, selectedLayout } = useUserPrefs();
  const uploadId = selectedLayout.uploadId;

  // Fetch available symbols
  const { data: symbols = [] } = useQuery({
    queryKey: ["symbols", uploadId],
    queryFn: () => (uploadId ? metricsAPI.getSymbols(uploadId) : Promise.resolve([])),
    enabled: !!uploadId,
  });

  const form = useForm<WidgetSettingsValues>({
    resolver: zodResolver(widgetSettingsSchema),
    defaultValues: {
      title: widget.title,
      symbol: widget.symbol,
    },
  });

  // Update form when widget changes
  useEffect(() => {
    form.reset({
      title: widget.title,
      symbol: widget.symbol,
    });
  }, [widget, form]);

  const onSubmit = (values: WidgetSettingsValues) => {
    updateWidget(layoutId, widget.id, {
      title: values.title,
      symbol: values.symbol,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Widget Settings</DialogTitle>
        </DialogHeader>
        
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
            
            {(widget.type === "vwapLineChart" || 
              widget.type === "tradePieChart") && (
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
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
