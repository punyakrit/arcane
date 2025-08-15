"use client";
import { Files, Folders } from "@prisma/client";
import React, { useEffect, useState } from "react";
import ToolTipCOmponent from "../global/ToolTipCOmponent";
import { PlusIcon } from "lucide-react";
import { generateUUID } from "@/lib/server-actions/exportuuid";
import { createFolder, getFilesByFolderId } from "@/lib/supabase/queries";
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
  workSpaceFolders: Folders[];
  workspaceId: string;
}

function FolderDropDownList({
  workSpaceFolders,
  workspaceId,
}: FolderDropDownListProps) {
  const [folders, setFolders] = useState<Folders[]>(workSpaceFolders || []);
  const [files, setFiles] = useState<Files[]>([]);
  const [openFolders, setOpenFolders] = useState<string[]>([]);


  useEffect(() => {
    const fetchFiles = async () => {
      let allFiles: Files[] = [];
      for (const folder of folders) {
        const { error, result } = await getFilesByFolderId(folder.id);
        if (error) {
          toast.error("Failed to fetch files");
        } else {
          allFiles = [...allFiles, ...(result || [])];
        }
      }
      setFiles(allFiles);
    };
    fetchFiles();
  }, [folders]);
  
  useEffect(() => {
    setFolders(workSpaceFolders || []);
  }, [workSpaceFolders, workspaceId]);

  async function addFolderHandler() {
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

    const { error, result } = await createFolder(newFolder);
    if (error) {
      toast.error("Failed to create a new folder");
    } else {
      setFolders([result as Folders, ...(folders || [])]);
      toast.success("Created a new folder");
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
                  setFolder={(folder: Folders) => {
                    setFolders(folders.map((f) => (f.id === folder.id ? folder : f)));
                  }}
                  files={files}
                  setFiles={(files: Files[]) => {
                    setFiles(files);
                  }}
                  onFileAdded={(folderId) => {
                    if (!openFolders.includes(folderId)) {
                      setOpenFolders([...openFolders, folderId]);
                    }
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
