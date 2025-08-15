"use client";
import React, { useMemo, useState, useCallback, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import clsx from "clsx";
import { EmojiPicker } from "../ui/emoji-picker";
import EmojiPickers from "../global/EmojiPicker";
import { createFile, deleteFolder, updateFolder, updateFile, deleteFiles } from "@/lib/supabase/queries";
import { Files, Folders } from "@prisma/client";
import { toast } from "sonner";
import { readonly } from "zod";
import { PlusIcon, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { generateUUID } from "@/lib/server-actions/exportuuid";

interface DropdownProps {
  title: string;
  id: string;
  listType: "folder" | "file";
  iconId: string;
  children?: React.ReactNode;
  disabled?: boolean;
  workspaceId: string;
  folderId: string;
  folder: Folders;
  setFolder: (folder: Folders) => void;
  files: Files[];
  setFiles: (files: Files[]) => void;
  onFileAdded?: (folderId: string) => void;
}

function Dropdown({
  title,
  id,
  listType,
  iconId,
  children,
  disabled,
  workspaceId,
  folderId,
  setFolder,
  folder,
  files,
  setFiles,
  onFileAdded,
  ...props
}: DropdownProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const [emoji, setEmoji] = useState(iconId);
  const [localTitle, setLocalTitle] = useState(title);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isEditing) {
      setLocalTitle(title);
    }
  }, [title, isEditing]);

  useEffect(() => {
    setEmoji(iconId);
  }, [iconId]);

  const folderTitle: string | undefined = useMemo(() => {
    if (listType === "folder") {
      return localTitle;
    }
    return undefined;
  }, [localTitle, listType]);

  const textTitle = useMemo(() => {
    if (listType === "file") {
      return localTitle;
    }
    return undefined;
  }, [localTitle, listType]);

  function navigatePage(accordionId: string, listType: "folder" | "file") {
    if (listType === "folder") {
      router.push(`/dashboard/${workspaceId}/${accordionId}`);
    } else {
      router.push(`/dashboard/${workspaceId}/${folderId}/${accordionId}`);
    }
  }

  const listStyle = useMemo(
    () =>
      clsx("relative w-full", {
        "border-none text-md": listType === "folder",
        "border-none text-sm ml-6  text-[16px]": listType === "file",
      }),
    [listType]
  );

  const groupIdentifier = clsx(
    "dark:text-white flex items-center w-full relative group min-w-0",
    {
      "group/folder": listType === "folder",
      "group/file": listType === "file",
    }
  );

  async function onChangeEmoji(emoji: string, itemId: string) {
    try {
      if (listType === "folder") {
        const { error, result } = await updateFolder(
          {
            id: itemId,
            iconId: emoji,
          },
          itemId
        );

        if (error) {
          toast.error("Failed to update emoji");
        } else {
          setEmoji(emoji);
          setFolder({
            ...folder,
            iconId: emoji,
          } as Folders);
          toast.success("Emoji updated");
        }
      } else if (listType === "file") {
        const { error, result } = await updateFile(
          {
            id: itemId,
            iconId: emoji,
          },
          itemId
        );

        if (error) {
          toast.error("Failed to update emoji");
        } else {
          setEmoji(emoji);
          const updatedFiles = files.map((file: Files) => 
            file.id === itemId ? { ...file, iconId: emoji, folderId: file.folderId, inTrash: file.inTrash } : file
          );
          setFiles(updatedFiles);
          toast.success("Emoji updated");
        }
      }
    } catch (err) {
      console.error("Error updating emoji:", err);
      toast.error("Failed to update emoji");
    }
  }

  function handleDoubleClick() {
    setIsEditing(true);
  }

  const debouncedUpdate = useCallback(
    async (newTitle: string) => {
      if (listType === "folder") {
        const { error } = await updateFolder(
          {
            id: folderId,
            title: newTitle,
          },
          folderId
        );

        if (error) {
          toast.error("Failed to update title");
          setLocalTitle(folder.title);
          setFolder({
            ...folder,
            title: folder.title,
          } as Folders);
        }
      } else if (listType === "file") {
        const { error } = await updateFile(
          {
            id: id,
            title: newTitle,
          },
          id
        );

        if (error) {
          toast.error("Failed to update title");
          setLocalTitle(title);
          const revertedFiles = files.map((file: Files) => 
            file.id === id ? { ...file, title: title, folderId: file.folderId, inTrash: file.inTrash } : file
          );
          setFiles(revertedFiles);
        }
      }
    },
    [folderId, folder, setFolder, listType, id, title, files, setFiles]
  );

  async function handleBlur() {
    setIsEditing(false);
    if (listType === "folder" && localTitle !== folder.title) {
      setFolder({
        ...folder,
        title: localTitle,
      } as Folders);
      await debouncedUpdate(localTitle);
    } else if (listType === "file" && localTitle !== title) {
      const updatedFiles = files.map((file: Files) => 
        file.id === id ? { ...file, title: localTitle, folderId: file.folderId, inTrash: file.inTrash } : file
      );
      setFiles(updatedFiles);
      await debouncedUpdate(localTitle);
    }
  }

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newTitle = e.target.value;
    setLocalTitle(newTitle);
  }

  async function addNewFile() {
    try {
      console.log("addNewFile");
      if (!workspaceId) {
        return;
      }
      const newFile: Files = {
        id: await generateUUID(),
        title: "New File",
        iconId: "📄",
        data: null,
        inTrash: null,
        bannerUrl: null,
        folderId: folderId,
        createdAt: new Date(),
      };

      const { error, result } = await createFile(newFile);
      if (error) {
        toast.error("Failed to add new file");
      } else {
        toast.success("New file added");
        setFiles([...files, result as Files]);
        onFileAdded?.(folderId);
      }
    } catch (err) {
      console.error("Error adding new file:", err);
      toast.error("Failed to add new file");
    }
  }

  async function deleteFile(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    
    if (listType === "folder") {
      const { error } = await deleteFolder(id);
      if (error) {
        toast.error("Failed to delete folder");
      } else {
        toast.success("Folder deleted");
        router.push(`/dashboard/${workspaceId}`);
      }
    } else if (listType === "file") {
      const { error } = await deleteFiles(id);
      if (error) {
        toast.error("Failed to delete file");
      } else {
        setFiles(files.filter((file: Files) => file.id !== id));
        toast.success("File deleted");
      }
    }
  }

  if (!isMounted) {
    return (
      <div className={listStyle}>
        <div className="hover:no-underline py-1 px-1 text-sm rounded-md transition-colors w-full">
          <div className={groupIdentifier}>
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="flex-shrink-0">
                <div
                  className={clsx(
                    "text-3xl p-2 h-auto cursor-pointer border rounded-md",
                    {
                      "text-sm": true,
                    }
                  )}
                >
                  {emoji}
                </div>
              </div>
              <div className="outline-none bg-transparent text-sm truncate min-w-0 flex-1 w-[70px]">
                {listType === "folder" ? folderTitle : textTitle}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (listType === "file") {
    return (
      <div className={listStyle}>
        <div 
          className="hover:no-underline py-1 px-1 text-sm hover:bg-muted/50 rounded-md transition-colors w-full cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            navigatePage(id, listType);
          }}
        >
          <div className={groupIdentifier}>
            <div className="flex items-center gap-3 min-w-0 flex-1 max-w-[calc(100%-70px)]">
              <div className="flex-shrink-0">
                <EmojiPickers
                  size="sm"
                  getValue={(emoji) => onChangeEmoji(emoji, id)}
                >
                  {emoji}
                </EmojiPickers>
              </div>
              <input
                type="text"
                value={textTitle}
                className={clsx(
                  "outline-none bg-transparent text-sm truncate min-w-0 flex-1",
                  isEditing
                    ? "bg-muted cursor-text px-2 py-1 rounded"
                    : "cursor-pointer"
                )}
                readOnly={!isEditing}
                onDoubleClick={handleDoubleClick}
                onBlur={handleBlur}
                onChange={handleTitleChange}
              />
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              <button
                className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive rounded-sm flex items-center justify-center cursor-pointer"
                onClick={deleteFile}
              >
                <Trash className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AccordionItem
      key={id}
      value={id}
      className={listStyle}
      onClick={(e) => {
        e.stopPropagation();
        navigatePage(id, listType);
      }}
    >
      <AccordionTrigger
        id={listType}
        className="hover:no-underline py-1 px-1 text-sm hover:bg-muted/50 rounded-md transition-colors w-full"
      >
        <div className={groupIdentifier}>
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="flex-shrink-0">
              <EmojiPickers
                size="sm"
                getValue={(emoji) => onChangeEmoji(emoji, id)}
              >
                {emoji}
              </EmojiPickers>
            </div>
            <input
              type="text"
              value={folderTitle}
              className={clsx(
                "outline-none bg-transparent text-sm truncate min-w-0 flex-1 w-[70px]",
                isEditing
                  ? "bg-muted cursor-text px-2 py-1 rounded"
                  : "cursor-pointer"
              )}
              readOnly={!isEditing}
              onDoubleClick={handleDoubleClick}
              onBlur={handleBlur}
              onChange={handleTitleChange}
            />
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2">
            {!isEditing && (
              <button
                className="h-6 w-6 z-50 p-0 hover:bg-muted rounded-sm flex items-center justify-center cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  addNewFile();
                }}
              >
                <PlusIcon className="w-3 h-3" />
              </button>
            )}
            <button
              className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive rounded-sm flex items-center justify-center cursor-pointer"
              onClick={deleteFile}
            >
              <Trash className="w-3 h-3" />
            </button>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="p-0">
        {files
          .filter((file) => file.folderId === folderId)
          .filter((file) => !file.inTrash )
          .map((file) => (
            <Dropdown
              key={file.id}
              title={file.title}
              id={file.id}
              listType="file"
              iconId={file.iconId || ""}
              workspaceId={workspaceId}
              folderId={folderId}
              folder={folder}
              setFolder={setFolder}
              files={[]}
              setFiles={setFiles}
              onFileAdded={onFileAdded}
            />
          ))}
      </AccordionContent>
    </AccordionItem>
  );
}

export default Dropdown;
