"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import CustomDialogTrigger from "./CustomDialogTrigger";

interface WorkspaceDropDownProps {
  privateWorkspaces: any[];
  collaboratorsWorkspaces: any[];
  defaultWorkspace: any;
}

function WorkspaceDropDown({
  privateWorkspaces,
  collaboratorsWorkspaces,
  defaultWorkspace,
}: WorkspaceDropDownProps) {
  const router = useRouter();
  const params = useParams();
  const [selectedWorkspace, setSelectedWorkspace] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);



  const allWorkspaces = [...privateWorkspaces, ...collaboratorsWorkspaces];

  useEffect(() => {
    console.log(allWorkspaces)
    const currentWorkspaceId = params.workspaceId as string;
    const currentWorkspace = allWorkspaces.find(
      (workspace) => workspace.id === currentWorkspaceId
    );

    if (currentWorkspace) {
      setSelectedWorkspace(currentWorkspace);
    } else if (defaultWorkspace && defaultWorkspace.length > 0) {
      setSelectedWorkspace(defaultWorkspace[0]);
    }
  }, [params.workspaceId, allWorkspaces, defaultWorkspace]);

  useEffect(() => {
    if (allWorkspaces.length > 0 && !selectedWorkspace) {
      const currentWorkspaceId = params.workspaceId as string;
      const currentWorkspace = allWorkspaces.find(
        (workspace) => workspace.id === currentWorkspaceId
      );

      if (currentWorkspace) {
        setSelectedWorkspace(currentWorkspace);
      }
    }
  }, [allWorkspaces, selectedWorkspace, params.workspaceId]);

  const handleWorkspaceChange = (workspace: any) => {
    setSelectedWorkspace(workspace);
    setIsOpen(false);
    router.push(`/dashboard/${workspace.id}`);
  };

  return (
    <div className="relative inline-block w-full text-left">
      <Popover
        open={isOpen}
        onOpenChange={setIsOpen}
        key={selectedWorkspace?.id}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            className="w-full h-auto justify-between"
          >
            {selectedWorkspace ? (
              <div className="flex items-center gap-2">
                <span className="text-xl">{selectedWorkspace.iconId}</span>
                <span>{selectedWorkspace.title}</span>
              </div>
            ) : (
              "Select workspace..."
            )}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0">
          <Command>
            {/* <CommandInput placeholder="Search workspace..." className="h-9" /> */}
            <CommandList>
              <CommandEmpty>No workspace found.</CommandEmpty>
              <CommandGroup>
                {allWorkspaces.map((workspace) => (
                  <CommandItem
                    key={workspace.id}
                    value={workspace.title}
                    onSelect={() => {
                      handleWorkspaceChange(workspace);
                    }}
                  >
                    <span className="text-2xl mr-2">{workspace.iconId}</span>
                    {workspace.title}
                    <Check
                      className={cn(
                        "ml-auto",
                        selectedWorkspace?.id === workspace.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CustomDialogTrigger />
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default WorkspaceDropDown;
