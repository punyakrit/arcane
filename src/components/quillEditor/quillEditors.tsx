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
import { useSocket } from "@/lib/provider/socket-provider";
import { getUserById } from "@/lib/supabase/queries";

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
  [{ list: "ordered" }, { list: "bullet" }]
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
  const { socket, isConnected } = useSocket();
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
  >([]);

  const [saving, setSaving] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string>("");
  const [localCursors, setLocalCursors] = useState<any>([]);
  const [user, setUser] = useState<any>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSaving = useRef(false);
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

  useEffect(() => {
    if (quillEditor && currentData?.data && !isSaving.current) {
      // Store current selection before updating content
      const selection = quillEditor.getSelection();
      const currentContent = JSON.stringify(quillEditor.getContents());
      const newContent = currentData.data || "{}";
      
      // Only update content if it's actually different to avoid unnecessary cursor resets
      if (currentContent !== newContent) {
        quillEditor.setContents(JSON.parse(newContent));
        
        // Restore selection if it was valid and user had focus
        if (selection && document.hasFocus()) {
          const newLength = quillEditor.getLength();
          const adjustedIndex = Math.min(selection.index, Math.max(0, newLength - 1));
          const adjustedLength = Math.min(selection.length, newLength - adjustedIndex);
          
          setTimeout(() => {
            try {
              quillEditor.setSelection(adjustedIndex, adjustedLength);
            } catch (error) {
              // Fallback if selection fails
              console.warn('Could not restore cursor position:', error);
            }
          }, 0);
        }
      }
    }
  }, [quillEditor, currentData?.data]);

  useEffect(() => {
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUserData();
  }, []);

  useEffect(() => {
    if (quillEditor === null || socket === null || !currentData?.id || !localCursors.length || !isConnected)
      return;
    const socketHandler = (range: any, roomId: string, cursorId: string) => {
      if (roomId === currentData?.id) {
        const cursorToMove = localCursors.find(
          (c: any) => c.cursors()?.[0].id === cursorId
        );
        if (cursorToMove) {
          cursorToMove.moveCursor(cursorId, range);
        }
      }
    };
    socket.on('receive-cursor-move', socketHandler);
    return () => {
      socket.off('receive-cursor-move', socketHandler);
    };
  }, [quillEditor, socket, currentData?.id, localCursors]);

  useEffect(() => {
    if (socket === null || quillEditor === null || !currentData?.id || !isConnected) return;
    
    console.log('🏠 Joining room:', currentData?.id);
    socket.emit('create-room', currentData?.id);
    
    // Cleanup function to leave room when component unmounts or dependencies change
    return () => {
      if (socket && currentData?.id) {
        console.log('🚪 Leaving room:', currentData?.id);
        socket.emit('leave-room', currentData?.id);
      }
    };
  }, [socket, quillEditor, currentData?.id]);

  useEffect(() => {
    if (quillEditor === null || socket === null || !currentData?.id || !user || !isConnected) return;
    
    console.log('🔧 Setting up Quill event handlers for room:', currentData?.id);

    const selectionChangeHandler = (cursorId: string) => {
      return (range: any, oldRange: any, source: any) => {
        if (source === 'user' && cursorId && isConnected && socket.connected) {
          socket.emit('send-cursor-move', range, currentData?.id, cursorId);
        }
      };
    };
    
    const quillHandler = (delta: any, oldDelta: any, source: any) => {
      console.log('📝 Text change detected:', source);
      if (source !== 'user') return;
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      setSaving(true);
      isSaving.current = true;
      const contents = quillEditor.getContents();
      const quillLength = quillEditor.getLength();
      
      // Store current cursor position
      const selection = quillEditor.getSelection();
      
      saveTimerRef.current = setTimeout(async () => {
        if (contents && quillLength !== 1 && currentData?.id) {
          try {
            if (dirType === 'workspace' && currentData?.id) {
              await updateWorkspaceInStore(currentData.id, { data: JSON.stringify(contents) });
            } else if (dirType === 'folder' && currentData?.id) {
              await updateFolderInStore(currentData.id, { data: JSON.stringify(contents) });
            } else if (dirType === 'file' && currentData?.id) {
              await updateFileInStore(currentData.id, { data: JSON.stringify(contents) });
            }
            
            // Restore cursor position after save
            if (selection && quillEditor) {
              setTimeout(() => {
                quillEditor.setSelection(selection.index, selection.length);
              }, 0);
            }
          } catch (error) {
            console.error('Failed to save content:', error);
          }
        }
        setSaving(false);
        isSaving.current = false;
      }, 850);

      if (isConnected && socket && socket.connected) {
        socket.emit('send-changes', delta, currentData?.id);
        console.log('✅ Changes sent to room:', currentData?.id);
      } else {
        console.error('❌ Socket not connected, cannot send changes');
      }
    };
    
    quillEditor.on('text-change', quillHandler);
    quillEditor.on('selection-change', selectionChangeHandler(user.id));

    return () => {
      console.log('🧹 Cleaning up Quill event handlers');
      quillEditor.off('text-change', quillHandler);
      quillEditor.off('selection-change', selectionChangeHandler);
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [quillEditor, socket, currentData?.id, user]);

  useEffect(() => {
    if (quillEditor === null || socket === null || !isConnected) return;
    const socketHandler = (deltas: any, id: string) => {
      console.log('📥 Received socket changes for room:', id);
      if (id === currentData?.id) {
        console.log('✅ Applying changes to editor');
        // Store current selection before applying remote changes
        const selection = quillEditor.getSelection();
        const oldLength = quillEditor.getLength();
        // Apply the remote changes
        quillEditor.updateContents(deltas);
        
        // Only restore selection if this user had focus and the position is still valid
        if (selection && document.hasFocus() && !isSaving.current) {
          const newLength = quillEditor.getLength();
          // Adjust selection if content length changed
          const adjustedIndex = Math.min(selection.index, newLength - 1);
          const adjustedLength = Math.min(selection.length, newLength - adjustedIndex);
          
          setTimeout(() => {
            try {
              quillEditor.setSelection(adjustedIndex, adjustedLength);
            } catch (error) {
              // Fallback to end of document if selection fails
              quillEditor.setSelection(quillEditor.getLength() - 1, 0);
            }
          }, 0);
        }
      }
    };
    socket.on('receive-changes', socketHandler);
    return () => {
      socket.off('receive-changes', socketHandler);
    };
  }, [quillEditor, socket, currentData?.id]);

  useEffect(() => {
    if (!currentData?.id || quillEditor === null) return;
    const room = supabase.channel(currentData?.id);
    const subscription = room
      .on('presence', { event: 'sync' }, () => {
        const newState = room.presenceState();
        const newCollaborators = Object.values(newState).flat() as any;
        setCollaborators(newCollaborators);
        if (user) {
          const allCursors: any = [];
          newCollaborators.forEach(
            (collaborator: { id: string; email: string; avatarUrl: string }) => {
              if (collaborator.id !== user.id) {
                const userCursor = quillEditor.getModule('cursors');
                userCursor.createCursor(
                  collaborator.id,
                  collaborator.email.split('@')[0],
                  `#${Math.random().toString(16).slice(2, 8)}`
                );
                allCursors.push(userCursor);
              }
            }
          );
          setLocalCursors(allCursors);
        }
      })
      .subscribe(async (status) => {
        if (status !== 'SUBSCRIBED' || !user) return;
        const response = await getUserById(user.id);
        if (!response) return;

        room.track({
          id: user.id,
          email: user.email?.split('@')[0],
          avatarUrl: response.result?.id 
            ? supabase.storage.from('avatars').getPublicUrl(`avatar-${response.result.id}`)
                .data.publicUrl
            : '',
        });
      });
    return () => {
      supabase.removeChannel(room);
    };
  }, [currentData?.id, quillEditor, supabase, user]);

  const containerRef = useCallback(async (wrapper: HTMLDivElement) => {
    if (typeof window !== "undefined") {
      if (wrapper == null) return;

      wrapper.innerHTML = "";
      const editor = document.createElement("div");
      wrapper.append(editor);
      const Quill = (await import("quill")).default;
      const QuillCursors = (await import("quill-cursors")).default;
      Quill.register("modules/cursors", QuillCursors);
      const quillEditor = new Quill(editor, {
        theme: "snow",
        modules: {
          toolbar: TOOLBAR_OPTIONS,
          cursors: {
            transformOnTextChange: true,
          },
        },
      });
      
      console.log("📝 Quill editor initialized:", !!quillEditor);
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
    <div className="w-full">
      <div className="flex justify-center">
        <div className="w-full max-w-[1200px]">
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
        <div className="flex flex-col px-7 lg:py-4 w-[800px] max-w-full">
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
          <span className="text-3xl text-muted-foreground h-9 font-bold mt-4">
            {currentData?.title}
          </span>
          <span className="text-sm text-muted-foreground">
            {dirType === "workspace"
              ? "WORKSPACE"
              : dirType === "folder"
              ? "FOLDER"
              : "FILE"}
          </span>
        </div>
        <div className="w-[800px] max-w-full">
          <div
            id="container"
            ref={containerRef as any}
            className="h-[500px]"
          ></div>
        </div>
      </div>
    </div>
    // </div>
  );
}

export default quillEditors;
