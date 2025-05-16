
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { uploadAPI } from "@/lib/api";
import { Upload } from "@/types";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function UploadTable() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["uploads", page, pageSize],
    queryFn: () => uploadAPI.getAll(page, pageSize),
  });

  const handleRowClick = (upload: Upload) => {
    navigate(`/dashboard/${upload.id}`);
  };

  // Status badge configuration
  const statusConfig = {
    pending: { variant: "outline", label: "Pending" },
    processing: { variant: "secondary", label: "Processing" },
    completed: { variant: "default", label: "Completed" },
    failed: { variant: "destructive", label: "Failed" },
  };

  // Generate pagination pages
  const generatePaginationItems = () => {
    if (!data) return [];
    
    const totalPages = Math.ceil(data.total / pageSize);
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // Complex pagination logic for many pages
    if (page <= 3) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    } else if (page >= totalPages - 2) {
      return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    } else {
      return [1, "...", page - 1, page, page + 1, "...", totalPages];
    }
  };

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-destructive">Error loading uploads.</p>
        <Button onClick={() => window.location.reload()} variant="outline" className="mt-2">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Filename</TableHead>
              <TableHead>Row Count</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                </TableRow>
              ))
            ) : data?.data.length ? (
              data.data.map((upload) => (
                <TableRow 
                  key={upload.id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(upload)}
                >
                  <TableCell>
                    {format(new Date(upload.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>{upload.filename}</TableCell>
                  <TableCell>{upload.rowCount || "-"}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={statusConfig[upload.status].variant as any}
                      className={upload.status === "processing" ? "animate-pulse-subtle" : ""}
                    >
                      {statusConfig[upload.status].label}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                  No uploads found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {data && data.total > pageSize && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {generatePaginationItems().map((pageNum, idx) => (
              <PaginationItem key={idx}>
                {pageNum === "..." ? (
                  <span className="px-2">...</span>
                ) : (
                  <PaginationLink
                    isActive={page === pageNum}
                    onClick={() => typeof pageNum === "number" && setPage(pageNum)}
                  >
                    {pageNum}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setPage(p => p + 1)}
                className={!data || page >= Math.ceil(data.total / pageSize) ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
