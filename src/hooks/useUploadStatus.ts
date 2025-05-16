
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Upload } from "../types";
import { uploadAPI } from "../lib/api";

export function useUploadStatus(uploadId: string | undefined) {
  const [isComplete, setIsComplete] = useState(false);

  const query = useQuery({
    queryKey: ["upload", uploadId],
    queryFn: () => uploadId ? uploadAPI.getById(uploadId) : Promise.resolve(null),
    enabled: !!uploadId,
    refetchInterval: (data) => {
      // Poll every 3 seconds until upload is complete
      if (data && data.status === "completed" || data?.status === "failed") {
        setIsComplete(true);
        return false; // Stop polling
      }
      return 3000; // Poll every 3 seconds
    },
  });
  
  return {
    ...query,
    isComplete,
    upload: query.data as Upload | null,
  };
}

export default useUploadStatus;
