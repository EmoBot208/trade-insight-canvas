
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUserPrefs } from "@/contexts/UserPrefsContext";
import useUploadStatus from "@/hooks/useUploadStatus";
import { v4 as uuidv4 } from "uuid";
import GridLayout from "@/components/dashboard/GridLayout";
import WidgetRenderer from "@/components/dashboard/WidgetRenderer";
import { AddWidgetModal } from "@/components/dashboard/AddWidgetModal";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Save,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
  const { uploadId } = useParams<{ uploadId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    preferences,
    selectedLayout,
    setSelectedLayout,
    createLayout,
    updatePreferences,
    isSyncing,
  } = useUserPrefs();
  
  const [addingWidget, setAddingWidget] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newLayoutName, setNewLayoutName] = useState("");
  
  // Fetch upload status
  const { upload, isLoading, error, isComplete } = useUploadStatus(uploadId);

  // Create or select a layout for this upload
  useEffect(() => {
    if (uploadId && upload) {
      // Check if we have a layout for this upload
      const existingLayout = preferences.layouts.find(layout => layout.uploadId === uploadId);
      
      if (existingLayout) {
        // Use the existing layout
        setSelectedLayout(existingLayout.id);
      } else {
        // Create a new layout for this upload
        createLayout(`${upload.filename} Layout`, uploadId);
      }
    } else if (!uploadId) {
      // No upload ID specified, use default layout
      setSelectedLayout(preferences.defaultLayout);
    }
  }, [uploadId, upload, preferences.layouts, setSelectedLayout, createLayout, preferences.defaultLayout]);

  // Handle layout saving
  const handleSaveLayout = async () => {
    setIsSaving(true);
    try {
      // Save user preferences to backend
      // This is handled automatically by the usePersistedState hook
      toast({
        title: "Layout saved",
        description: "Your dashboard layout has been saved.",
      });
    } catch (error) {
      toast({
        title: "Failed to save",
        description: "There was an error saving your layout.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle creating a new layout
  const handleCreateLayout = () => {
    if (newLayoutName) {
      createLayout(newLayoutName, uploadId);
      setNewLayoutName("");
    }
  };

  // If upload is not found or has failed
  if (error && uploadId) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4">
        <h3 className="text-xl font-medium mb-2">Upload Not Found</h3>
        <p className="text-muted-foreground mb-4">The requested upload could not be found.</p>
        <Button onClick={() => navigate("/history")}>Return to Upload History</Button>
      </div>
    );
  }

  // Show loading state while upload is being processed
  if (isLoading || (uploadId && !isComplete)) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <h3 className="text-xl font-medium mb-2">Processing Upload</h3>
        <p className="text-muted-foreground">
          Please wait while we process your upload. This may take a moment.
        </p>
      </div>
    );
  }

  // Show dashboard content
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {uploadId && upload 
              ? `Dashboard: ${upload.filename}`
              : "Trading Dashboard"
            }
          </h1>
          <p className="text-sm text-muted-foreground">
            {uploadId
              ? `Upload ID: ${uploadId}`
              : "Configure and view your trading analytics"
            }
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={selectedLayout.id}
            onValueChange={setSelectedLayout}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select layout" />
            </SelectTrigger>
            <SelectContent>
              {preferences.layouts.map((layout) => (
                <SelectItem key={layout.id} value={layout.id}>
                  {layout.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="mr-1 h-4 w-4" />
                New Layout
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Create New Layout</AlertDialogTitle>
                <AlertDialogDescription>
                  Enter a name for your new dashboard layout.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="py-4">
                <input
                  type="text"
                  value={newLayoutName}
                  onChange={(e) => setNewLayoutName(e.target.value)}
                  placeholder="Layout name"
                  className="w-full px-3 py-2 border border-input bg-background rounded-md"
                />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleCreateLayout}>Create</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button onClick={() => setAddingWidget(true)}>
            <Plus className="mr-1 h-4 w-4" />
            Add Widget
          </Button>

          <Button onClick={handleSaveLayout} disabled={isSaving || isSyncing}>
            {isSaving || isSyncing ? (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-1 h-4 w-4" />
            )}
            Save Layout
          </Button>
        </div>
      </div>

      <div className="min-h-[500px] border rounded-lg bg-card/50">
        {selectedLayout.widgets.length > 0 ? (
          <GridLayout
            layoutId={selectedLayout.id}
            widgets={selectedLayout.widgets}
          >
            {selectedLayout.widgets.map((widget) => (
              <WidgetRenderer
                key={widget.id}
                widget={widget}
                layoutId={selectedLayout.id}
                uploadId={uploadId || selectedLayout.uploadId || ""}
              />
            ))}
          </GridLayout>
        ) : (
          <div className="h-[500px] flex flex-col items-center justify-center">
            <h3 className="text-xl font-medium mb-2">No Widgets</h3>
            <p className="text-muted-foreground mb-4">
              Add widgets to start building your dashboard.
            </p>
            <Button onClick={() => setAddingWidget(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Widget
            </Button>
          </div>
        )}
      </div>

      {/* Add Widget Modal */}
      <AddWidgetModal
        layoutId={selectedLayout.id}
        open={addingWidget}
        onClose={() => setAddingWidget(false)}
      />
    </div>
  );
}
