import { useState, useCallback } from "react";
import { compressImage } from "./compressImage";

export interface UploadState {
  status: "idle" | "compressing" | "uploading" | "success" | "error";
  progress: number;
  secureUrl: string;
  message: string | null;
}

export function useUpload(onUploadComplete: (url: string) => void) {
  const [state, setState] = useState<UploadState>({
    status: "idle",
    progress: 0,
    secureUrl: "",
    message: null,
  });

  const reset = useCallback(() => {
    setState({ status: "idle", progress: 0, secureUrl: "", message: null });
  }, []);

  const cancel = useCallback(() => {
    // Gracefully fallback layout states to idle status
    setState({ status: "idle", progress: 0, secureUrl: "", message: "Upload cancelled by user." });
  }, []);

  const upload = useCallback(async (file: File) => {
    try {
      // 1. Kick off UI compression step tracker loops
      setState({ status: "compressing", progress: 25, secureUrl: "", message: null });
      
      const compressedBlob = await compressImage(file);
      const optimizedFile = new File([compressedBlob], `${file.name.split(".")[0]}.webp`, {
        type: compressedBlob.type,
      });

      setState({ status: "uploading", progress: 60, secureUrl: "", message: null });

      // 2. Mocking standard multipart endpoint execution simulation profiles 
      // (This safely bridges with the current project's dummy image storage parameters)
      const fakeUrlResponse = URL.createObjectURL(optimizedFile);
      
      setState({ status: "success", progress: 100, secureUrl: fakeUrlResponse, message: null });
      onUploadComplete(fakeUrlResponse);

    } catch (error: any) {
      setState({
        status: "error",
        progress: 0,
        secureUrl: "",
        message: error?.message || "An image optimization error occurred.",
      });
    }
  }, [onUploadComplete]);

  return { state, upload, reset, cancel };
}
