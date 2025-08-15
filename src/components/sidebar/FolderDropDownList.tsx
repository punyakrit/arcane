"use client";
import { Folders } from "@prisma/client";
import React, { useEffect, useState } from "react";
import ToolTipCOmponent from "../global/ToolTipCOmponent";
import { PlusIcon } from "lucide-react";
import { generateUUID } from "@/lib/server-actions/exportuuid";
import { createFolder } from "@/lib/supabase/queries";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

interface FolderDropDownListProps {
  workSpaceFolders: Folders[];
  workspaceId: string;
}

function FolderDropDownList({
  workSpaceFolders,
  workspaceId,
}: FolderDropDownListProps) {
  const [folders, setFolders] = useState<Folders[]>(workSpaceFolders || []);

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
    <>
      <div className="flex sticky z-20 top-0 bg-background w-full h-10 group/title justify-between items-center pr-4 text-white/80">
        <div className="font-bold text-xm flex justify-between items-center w-full">
          <span>Folders</span>

          <PlusIcon
            onClick={addFolderHandler}
            size={24}
            className="transition-transform duration-500 text-white/40 group-hover/title:inline-block cursor-pointer hover:dark:text-white ml-2"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2 mr-4">
        <Accordion
          type="multiple"
          defaultValue={folders.map((folder) => folder.id) || ""}
          className=" pb-20"
        >
          {folders
            .filter((folder) => folder.inTrash === null)
            .map((folder) => (
              <div key={folder.id}>
                
              </div>
            ))}
        </Accordion>
      </div>
    </>
  );
}

export default FolderDropDownList;
