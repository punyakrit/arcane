"use client";
import { Files, Folders } from "@prisma/client";
import React, { useEffect, useState } from "react";
import ToolTipCOmponent from "../global/ToolTipCOmponent";
import { PlusIcon } from "lucide-react";
import { generateUUID } from "@/lib/server-actions/exportuuid";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Button } from "../ui/button";
import Dropdown from "./Dropdown";
import { ScrollArea } from "../ui/scroll-area";

interface FolderDropDownListProps {
  workspaceId: string;
}

function FolderDropDownList({
  workspaceId,
}: FolderDropDownListProps) {
  const { folders, files, addFolder, loadFolderFiles } = useWorkspaceStore();
  const [openFolders, setOpenFolders] = useState<string[]>([]);


  async function addFolderHandler() {
    try {
      const id = await generateUUID();
      const newFolder: Folders = {
        id: id,
        title: "Untitled Folder",
        data: null,
        workSpaceId: workspaceId,
        createdAt: new Date(),
        iconId: "📁",
        inTrash: null,
        bannerUrl: "",
      };

      await addFolder(newFolder);
      toast.success("Created a new folder");
    } catch (error) {
      toast.error("Failed to create a new folder");
    }
  }

  return (
    <div className="w-full overflow-hidden flex flex-col h-full max-h-[450px]">
      <div className="flex w-full h-12 justify-between items-center px-2 py-2 text-white/80 border-b border-border/50 relative z-10 bg-background flex-shrink-0">
        <div className="font-bold text-sm flex justify-between items-center w-full min-w-0">
          <span className="truncate">Folders</span>

          <div className="flex items-center flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={addFolderHandler}
              className="h-8 w-8 p-0 bg-muted/20 hover:bg-muted/50 text-white border border-border/50 relative z-20 cursor-pointer"
            >
              <PlusIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      <ScrollArea className="flex-1 overflow-scroll relative"> 
      <div className="flex flex-col gap-1 relative z-0 w-full overflow-hidden pt-2">
        <Accordion
          type="multiple"
          value={openFolders}
          onValueChange={setOpenFolders}
          className="pb-20 w-full"
        >
          {folders
            .filter((folder) => folder.inTrash === null)
            .sort((a, b) => a.title.localeCompare(b.title))
            .map((folder) => (

              <div key={folder.id} className="relative w-full">
                <Dropdown
                  title={folder.title}
                  id={folder.id}
                  listType="folder"
                  iconId={folder.iconId || ""}
                  workspaceId={workspaceId}
                  folderId={folder.id}
                  folder={folder}
                  files={folder.files || []}
                  onFileAdded={(folderId) => {
                    setOpenFolders(prevOpenFolders => {
                      if (!prevOpenFolders.includes(folderId)) {
                        return [...prevOpenFolders, folderId];
                      }
                      return prevOpenFolders;
                    });
                  }}
                />
              </div>
            ))}
        </Accordion>
      </div>
      </ScrollArea>
    </div>
  );
}

export default FolderDropDownList;
