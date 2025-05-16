
import { useState } from "react";
import { Widget } from "@/types";
import { useUserPrefs } from "@/contexts/UserPrefsContext";
import { GripVertical, X, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WidgetSettingsModal } from "./WidgetSettingsModal";

interface WidgetHeaderProps {
  widget: Widget;
  layoutId: string;
}

export default function WidgetHeader({ widget, layoutId }: WidgetHeaderProps) {
  const { removeWidget } = useUserPrefs();
  const [showSettings, setShowSettings] = useState(false);
  
  return (
    <div className="widget-drag-handle p-3 border-b flex items-center justify-between bg-card">
      <div className="flex items-center gap-2">
        <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
        <h3 className="text-sm font-medium">{widget.title}</h3>
        {widget.symbol && (
          <span className="text-xs bg-muted px-2 py-0.5 rounded-md text-muted-foreground">
            {widget.symbol}
          </span>
        )}
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => setShowSettings(true)}
        >
          <Settings className="h-3.5 w-3.5" />
          <span className="sr-only">Settings</span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
            >
              <X className="h-3.5 w-3.5" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => removeWidget(layoutId, widget.id)}
            >
              Remove widget
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {showSettings && (
        <WidgetSettingsModal 
          widget={widget}
          layoutId={layoutId}
          open={showSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
