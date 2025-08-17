"use client";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { createClient } from "@/lib/supabase/client";
import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

function BannerUploadForm({
  setIsOpen,
  dirType,
  fileId,
}: {
  setIsOpen: (isOpen: boolean) => void;
  dirType: "workspace" | "folder" | "file";
  fileId: string;
}) {
  const supabase = createClient();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentWorkspace, breadcrumb, updateWorkspaceInStore, updateFolderInStore, updateFileInStore } = useWorkspaceStore();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsUploading(true);
    setError(null);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const file = formData.get("bannerImage") as File;
    
    if (!file) {
      setError("Please select a file");
      setIsUploading(false);
      return;
    }
    
    try {
      let filePath = "";
      const { data, error } = await supabase.storage
        .from("file-banner")
        .upload(`banner-${fileId}`, file, {
          cacheControl: "3600",
          upsert: true,
        });
        
      if (error) {
        throw error;
      }
      
      filePath = data.path;
      console.log("Uploaded file path:", filePath);
      
      
      if (dirType === "workspace" && currentWorkspace?.id) {
        await updateWorkspaceInStore(currentWorkspace.id, {
          bannerUrl: filePath
        });
      } else if (dirType === "folder" && breadcrumb.folder?.id) {
        await updateFolderInStore(breadcrumb.folder.id, {
          bannerUrl: filePath
        });
      } else if (dirType === "file" && breadcrumb.file?.id) {
        await updateFileInStore(breadcrumb.file.id, {
          bannerUrl: filePath
        });
      }
      
      setIsOpen(false);
    } catch (error) {
      setError("Error uploading banner image");
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <Label className="text-sm text-muted-foreground" htmlFor="bannerImage">
          Banner
        </Label>
        <Input
          type="file"
          name="bannerImage"
          accept="image/*"
          disabled={isUploading}
        />
        {error && (
          <small className="text-red-600">{error}</small>
        )}
        <div>

        <Button type="submit" disabled={isUploading} className="mt-2">
          {isUploading ? "Uploading..." : "Upload"}
        </Button>
        </div>
      </div>
    </form>
  );
}

export default BannerUploadForm;
