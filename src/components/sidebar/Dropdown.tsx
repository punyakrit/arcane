"use client";
import React, { useMemo, useState, useCallback, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AccordionItem, AccordionTrigger } from "../ui/accordion";
import clsx from "clsx";
import { EmojiPicker } from "../ui/emoji-picker";
import EmojiPickers from "../global/EmojiPicker";
import { updateFolder } from "@/lib/supabase/queries";
import { Folders } from "@prisma/client";
import { toast } from "sonner";
import { readonly } from "zod";
import { PlusIcon, Trash } from "lucide-react";
import { Button } from "../ui/button";

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
    setLocalTitle(title);
  }, [title]);

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
        "border-none text-sm ml-6 py-1 text-[16px]": listType === "file",
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

  async function onChangeEmoji(emoji: string, folderId: string) {
    if (listType === "folder") {
      setEmoji(emoji);
      const { error, result } = await updateFolder(
        {
          id: folderId,
          iconId: emoji,
        },
        folderId
      );

      if (error) {
        setEmoji(iconId);
        toast.error("Failed to update emoji");
      } else {
        setFolder({
          ...folder,
          iconId: emoji,
        } as Folders);
        toast.success("Emoji updated");
      }
    }
  }

  function handleDoubleClick() {
    setIsEditing(true);
  }

  const debouncedUpdate = useCallback(
    async (newTitle: string) => {
      const fId = folderId;
      const { error } = await updateFolder(
        {
          id: fId,
          title: newTitle,
        },
        fId
      );

      if (error) {
        toast.error("Failed to update title");
        setLocalTitle(folder.title);
      } else {
        setFolder({
          ...folder,
          title: newTitle,
        } as Folders);
      }
    },
    [folderId, folder, setFolder]
  );

  async function handleBlur() {
    setIsEditing(false);
    if (localTitle !== folder.title) {
      await debouncedUpdate(localTitle);
    }
  }

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newTitle = e.target.value;
    setLocalTitle(newTitle);
  }


  async function addNewFile(){

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

  return (
    <AccordionItem
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
        disabled={listType === "file"}
      >
        <div className={groupIdentifier}>
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="flex-shrink-0">
              <EmojiPickers
                size="sm"
                getValue={(emoji) => onChangeEmoji(emoji, folderId)}
              >
                {emoji}
              </EmojiPickers>
            </div>
            <input
              type="text"
              value={listType === "folder" ? folderTitle : textTitle}
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
            {listType === "folder" && !isEditing && (
              <div
                className="h-6 w-6 p-0 hover:bg-muted rounded-sm flex items-center justify-center cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <PlusIcon className="w-3 h-3" />
              </div>
            )}
            <div
              className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive rounded-sm flex items-center justify-center cursor-pointer"
              onClick={addNewFile}
            >
              <Trash className="w-3 h-3" />
            </div>
          </div>
        </div>
      </AccordionTrigger>
    </AccordionItem>
  );
}

export default Dropdown;
