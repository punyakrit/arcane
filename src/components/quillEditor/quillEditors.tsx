"use client";
import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import "quill/dist/quill.snow.css";
import { Files, Folders, WorkSpace } from "@prisma/client";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Check, Loader2, Trash } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import EmojiPickers from "../global/EmojiPicker";
import { toast } from "sonner";
import BannerUpload from "../banner/BannerUpload";
import { Button } from "../ui/button";

interface quillEditorsProps {
  dirType: "workspace" | "folder" | "file";
  fileId: string;
}

var TOOLBAR_OPTIONS = [
  ["bold", "italic", "underline", "strike"],
  ["blockquote", "code-block"],
  [{ header: 1 }, { header: 2 }],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }],
  [{ indent: "-1" }, { indent: "+1" }],
  [{ direction: "rtl" }],
  [{ size: ["small", false, "large", "huge"] }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ color: [] }, { background: [] }],
  [{ font: [] }],
  [{ align: [] }],
  ["clean"],
  ["link", "image", "blockquote", "code-block"],
  [{ list: "ordered" }, { list: "bullet" }],
];

const supabase = createClient();

function getBannerImageUrl(bannerUrl: string) {
  try {
    console.log("Input bannerUrl:", bannerUrl);
    console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);

    const publicUrl = supabase.storage
      .from("file-banner")
      .getPublicUrl(bannerUrl).data.publicUrl;

    console.log("Generated banner URL:", publicUrl);
    console.log("Full URL structure:", {
      bucket: "file-banner",
      path: bannerUrl,
      publicUrl: publicUrl,
    });

    if (!publicUrl) {
      console.error("No public URL generated");
      return null;
    }

    return publicUrl;
  } catch (error) {
    console.error("Error generating banner URL:", error);

    const fallbackUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/file-banner/${bannerUrl}`;
    console.log("Using fallback URL:", fallbackUrl);
    return fallbackUrl;
  }
}

async function checkFileExists(bannerUrl: string) {
  try {
    const { data, error } = await supabase.storage
      .from("file-banner")
      .list("", {
        search: bannerUrl,
      });

    console.log("File check result:", { data, error });

    if (error) {
      console.error("Storage list error:", error);
      return false;
    }

    return data && data.length > 0;
  } catch (error) {
    console.error("Error checking file existence:", error);
    return false;
  }
}

async function testStorageAccess() {
  try {
    const { data, error } = await supabase.storage.listBuckets();
    console.log("Available buckets:", { data, error });

    if (error) {
      console.error("Cannot access storage buckets:", error);
      return false;
    }

    const fileBannerBucket = data?.find(
      (bucket) => bucket.name === "file-banner"
    );
    console.log("file-banner bucket:", fileBannerBucket);

    return !!fileBannerBucket;
  } catch (error) {
    console.error("Error testing storage access:", error);
    return false;
  }
}

function quillEditors({ dirType, fileId }: quillEditorsProps) {
  const [quillEditor, setQuillEditor] = useState<any>(null);
  const [deleteBannerLoading, setDeleteBannerLoading] = useState(false);
  const {
    breadcrumb,
    currentWorkspace,
    folders,
    files,
    updateWorkspaceInStore,
    updateFolderInStore,
    updateFileInStore,
  } = useWorkspaceStore();
  const [collaborators, setCollaborators] = useState<
    { id: string; avatarUrl: string; email: string }[]
  >([
    {
      id: "1",
      avatarUrl: "https://github.com/shadcn.png",
      email: "shadcn@gmail.com",
    },
  ]);

  const [saving, setSaving] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string>("");
  const breadcrumbs = useMemo(() => {
    const breadcrumbParts = [];

    if (breadcrumb.workspace) {
      breadcrumbParts.push(
        `${breadcrumb.workspace.iconId || "📁"} ${breadcrumb.workspace.title}`
      );
    }

    if (breadcrumb.folder) {
      breadcrumbParts.push(
        `${breadcrumb.folder.iconId || "📁"} ${breadcrumb.folder.title}`
      );
    }

    if (breadcrumb.file) {
      breadcrumbParts.push(
        `${breadcrumb.file.iconId || "📄"} ${breadcrumb.file.title}`
      );
    }

    return breadcrumbParts.length > 0 ? breadcrumbParts.join(" / ") : null;
  }, [breadcrumb]);

  const currentData = useMemo(() => {
    if (dirType === "workspace") {
      return breadcrumb.workspace;
    }
    if (dirType === "folder") {
      return breadcrumb.folder;
    }
    if (dirType === "file") {
      return breadcrumb.file;
    }
    return null;
  }, [dirType, breadcrumb]);

  useEffect(() => {
    if (currentData?.bannerUrl) {
      console.log("Checking banner file existence for:", currentData.bannerUrl);
      checkFileExists(currentData.bannerUrl).then((exists) => {
        console.log("Banner file exists:", exists);
      });
    }

    testStorageAccess().then((accessible) => {
      console.log("Storage access test result:", accessible);
    });
  }, [currentData?.bannerUrl]);

  const handleContentChange = useCallback(
    async (content: string) => {
      if (!currentData) return;

      try {
        if (dirType === "workspace" && currentData.id) {
          await updateWorkspaceInStore(currentData.id, { data: content });
        } else if (dirType === "folder" && currentData.id) {
          await updateFolderInStore(currentData.id, { data: content });
        } else if (dirType === "file" && currentData.id) {
          await updateFileInStore(currentData.id, { data: content });
        }
      } catch (error) {
        console.error("Failed to save content:", error);
      }
    },
    [
      currentData,
      dirType,
      updateWorkspaceInStore,
      updateFolderInStore,
      updateFileInStore,
    ]
  );

  // useEffect(() => {
  //   if (quillEditor && currentData?.data) {
  //     quillEditor.setContents(JSON.parse(currentData.data || '{}'));
  //   }
  // }, [quillEditor, currentData?.data]);

  // useEffect(() => {
  //   if (quillEditor) {
  //     const handler = () => {
  //       const content = JSON.stringify(quillEditor.getContents());
  //       handleContentChange(content);
  //     };

  //     quillEditor.on('text-change', handler);
  //     return () => {
  //       quillEditor.off('text-change', handler);
  //     };
  //   }
  // }, [quillEditor, handleContentChange]);

  const containerRef = useCallback(async (wrapper: HTMLDivElement) => {
    if (typeof window !== "undefined") {
      if (wrapper == null) return;

      wrapper.innerHTML = "";
      const editor = document.createElement("div");
      wrapper.append(editor);
      const quill = (await import("quill")).default;
      const quillEditor = new quill(editor, {
        theme: "snow",
        modules: {
          toolbar: TOOLBAR_OPTIONS,
        },
      });
      setQuillEditor(quillEditor);
    }
  }, []);

  async function onChangeEmoji(emoji: string, itemId: string) {
    try {
      if (dirType === "workspace" && currentData?.id) {
        await updateWorkspaceInStore(currentData.id, { iconId: emoji });
      } else if (dirType === "folder" && currentData?.id) {
        await updateFolderInStore(currentData.id, { iconId: emoji });
      } else if (dirType === "file" && currentData?.id) {
        await updateFileInStore(currentData.id, { iconId: emoji });
      }
    } catch (err) {
      console.error("Error updating emoji:", err);
      toast.error("Failed to update emoji");
    }
  }


  async function handleDeleteBanner() {
    setDeleteBannerLoading(true);
    if (dirType === "workspace" && currentData?.id) {
      await updateWorkspaceInStore(currentData.id, { bannerUrl: null });
    } else if (dirType === "folder" && currentData?.id) {
      await updateFolderInStore(currentData.id, { bannerUrl: null });
    } else if (dirType === "file" && currentData?.id) {
      await updateFileInStore(currentData.id, { bannerUrl: null });
    }
    setDeleteBannerLoading(false);
  }

  return (
    <div className="flex justify-center w-full">
      <div className="w-[800px] max-w-full">
        <div className="flex flex-col-reverse sm:flex-row sm:justify-between justify-center sm:items-center sm:p-2 p-8">
          <div>{breadcrumbs}</div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 justify-center h-10">
              {collaborators.map((collaborator) => (
                <Avatar
                  key={collaborator.id}
                  className="-ml-4 bg-background border-2 flex items-center justify-center border-white h-8 w-8 rounded-full"
                >
                  <AvatarImage
                    className="rounded-full"
                    src={collaborator.avatarUrl ? collaborator.avatarUrl : ""}
                  />
                  <AvatarFallback>
                    {collaborator.email.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            {saving ? (
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-orange-500 top-6 text-white"
                >
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </Badge>
              </div>
            ) : (
              <Badge
                variant="secondary"
                className="bg-green-500 text-white top-6"
              >
                <Check className="w-4 h-4" />
                <span>Saved</span>
              </Badge>
            )}
          </div>
        </div>
        {currentData?.bannerUrl && (
          <div className="relative w-full h-[200px] mb-4">
            <Image
              className="w-full h-full object-cover rounded-lg"
              alt="banner"
              fill
              src={getBannerImageUrl(currentData.bannerUrl) || ""}
            />
          </div>
        )}

        <div className="flex justify-center items-center flex-col mt-2 relative">
          <div className="w-full flex flex-col px-7 lg:py-4">
            <div className="text-[80px]">
              <EmojiPickers
                getValue={(emoji: any) =>
                  onChangeEmoji(emoji, currentData?.id || "")
                }
              >
                <div className="w-[100px] cursor-pointer text-[80px] transition-colors h-[100px] flex items-center justify-center hover:bg-muted rounded-xl">
                  {currentData?.iconId}
                </div>
              </EmojiPickers>
            </div>
            <div>
              <div className="flex items-center">
                <BannerUpload
                  dirType={dirType}
                  fileId={fileId}
                  className="mt-2 text-sm text-muted-foreground p-2 transition-all rounded-md cursor-pointer"
                >
                  {currentData?.bannerUrl ? "Change Banner" : "Upload Banner"}
                </BannerUpload>
                {currentData?.bannerUrl && (
                  <>
                    <Button
                      onClick={handleDeleteBanner}
                      variant="ghost"
                      className="gap-4 ml-4 mt-2 text-sm text-muted-foreground p-2 transition-all rounded-md cursor-pointer"
                    >
                      {deleteBannerLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Trash className="w-4 h-4" />
                          <span>Delete Banner</span>
                        </>
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
          <div
            id="container"
            ref={containerRef as any}
            className="w-full"
          ></div>
        </div>
      </div>
    </div>
  );
}

export default quillEditors;
