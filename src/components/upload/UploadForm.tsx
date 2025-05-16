
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { uploadAPI } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";

// CSV validation schema
const uploadSchema = z.object({
  file: z
    .instanceof(FileList)
    .refine((files) => files.length === 1, "Please select a CSV file")
    .refine(
      (files) => {
        const file = files[0];
        return file && file.type === "text/csv";
      },
      "File must be a CSV"
    )
    .refine(
      (files) => {
        const file = files[0];
        return file && file.size <= 5 * 1024 * 1024; // 5MB max
      },
      "File size must be less than 5MB"
    ),
});

type UploadFormValues = z.infer<typeof uploadSchema>;

export default function UploadForm() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<UploadFormValues>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      file: undefined,
    },
  });

  const onSubmit = async (values: UploadFormValues) => {
    try {
      setUploading(true);
      
      const file = values.file[0];
      const formData = new FormData();
      formData.append("file", file);

      const response = await uploadAPI.create(formData, (progress) => {
        setProgress(progress);
      });

      toast({
        title: "Upload successful",
        description: `${file.name} has been uploaded and is being processed.`,
      });

      // Navigate to upload details or dashboard
      navigate(`/dashboard/${response.id}`);
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const { isSubmitting } = form.formState;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Upload Trade Data</CardTitle>
        <CardDescription>
          Upload a CSV file with trading data. The file should contain columns for timestamp,
          symbol, side, price, and quantity.
        </CardDescription>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="file"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>CSV File</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".csv"
                      onChange={(e) => onChange(e.target.files)}
                      disabled={isSubmitting || uploading}
                      className="cursor-pointer"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Uploading...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            <div className="text-sm text-muted-foreground">
              <h4 className="font-medium mb-2">Expected CSV format:</h4>
              <pre className="bg-secondary p-2 rounded-md overflow-x-auto">
                timestamp,symbol,side,price,quantity
              </pre>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting || uploading}
              className="w-full md:w-auto"
            >
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? "Uploading..." : "Upload File"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
