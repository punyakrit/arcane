"use client";
import { getSupabaseUser } from "@/lib/provider/getSupabaseUser";
import { Briefcase, Lock, Loader2, Plus, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  getWorkspaceDetails,
  deleteWorkspace,
  removeCollaboratorFromWorkspace,
  updateWorkspaceDetails,
  getWorkspaceCollaborators,
  getUserById,
} from "@/lib/supabase/queries";
import { User, WorkSpace } from "@prisma/client";

type CollaboratorUser = {
  id: string;
  email: string;
  userId: string;
  createdAt: Date;
};
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import CollabSearch from "./CollabSearch";
import { toast } from "sonner";
import { addCollaborator } from "@/actions/workspace";

interface SettingsFormsProps {
  workspaceId: string;
  closeModal: () => void;
}

function SettingsForms({ workspaceId, closeModal }: SettingsFormsProps) {
  const [permission, setPermission] = useState<string>("private");
  const [collaborators, setCollaborators] = useState<CollaboratorUser[]>([]);
  const [openAlertMessage, setOpenAlertMessage] = useState(false);
  const [workspaceDetails, setWorkspaceDetails] = useState<WorkSpace | null>(
    null
  );
  const [workspaceName, setWorkspaceName] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchWorkspaceDetails = async () => {
      const workspace = await getWorkspaceDetails(workspaceId);
      setWorkspaceDetails(workspace);
      setWorkspaceName(workspace?.title || "");

      const { result: workspaceCollaborators, error } = await getWorkspaceCollaborators(workspaceId);
      
      if (!error && workspaceCollaborators && workspaceCollaborators.length > 0) {
        setPermission("public");
        
        const collaboratorUsers: CollaboratorUser[] = [];
        for (const collaborator of workspaceCollaborators) {
          const { result: user, error: userError } = await getUserById(collaborator.userId);
          if (!userError && user) {
            collaboratorUsers.push(user);
          }
        }
        setCollaborators(collaboratorUsers);
      }
    };
    fetchWorkspaceDetails();
  }, [workspaceId]);

  async function workSpaceNameChage(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setWorkspaceName(value);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(async () => {
      const workspace = await updateWorkspaceDetails(workspaceId, {
        title: value,
      });
      setWorkspaceDetails(workspace);
    }, 1000);
    router.refresh();
  }

  function permissionsChage(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    // setPermissions(value);
  }

  async function removeCollaborator(collaborator: CollaboratorUser) {
    const { result: workspaceCollaborators } = await getWorkspaceCollaborators(workspaceId);
    const collaboratorRecord = workspaceCollaborators?.find(c => c.userId === collaborator.userId);
    
    if (collaboratorRecord) {
      await removeCollaboratorFromWorkspace(workspaceId, collaboratorRecord.id);
    }

    setCollaborators((prev) => prev.filter((c) => c.userId !== collaborator.userId));
  }

  async function handleDeleteWorkspace() {
    await deleteWorkspace(workspaceId);
    toast.success("Workspace deleted successfully");
    router.replace("/dashboard");
  }

  async function handleUpdateWorkspace() {
      if (permission === "public") {
        const resposne2 = await addCollaborator(collaborators, workspaceId);
        toast.success("Workspace updated successfully");

        router.refresh();
      }
    router.refresh();
    closeModal();    
}

  return (
    <div className="flex gap-4 flex-col max-h-[600px] overflow-y-auto">
      <p className="flex gap-2 mt-3 items-center">
        <Briefcase className="w-4 h-4" />
        <span className="text-sm font-medium">Workspace Details</span>
        <SelectSeparator />
      </p>
      <div className="flex flex-col gap-2">
        <Label>Name</Label>
        <Input
          placeholder="Workspace Name"
          value={workspaceName}
          onChange={workSpaceNameChage}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Collaborators</Label>
        <Select
          onValueChange={(value) =>
            setPermission(value as "public" | "private")
          }
          value={permission}
        >
          <SelectTrigger className="w-full h-auto min-h-[60px] p-3">
            <SelectValue placeholder="Select collaborators" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="private">
                <Lock className="w-4 h-4 mr-3" />
                <div className="flex flex-col items-start">
                  <span className="font-medium">Private</span>
                  <span className="text-sm text-muted-foreground">
                    Only you can access this workspace
                  </span>
                </div>
              </SelectItem>
              <SelectItem value="public">
                <Users className="w-4 h-4 mr-3" />
                <div className="flex flex-col items-start">
                  <span className="font-medium">Public</span>
                  <span className="text-sm text-muted-foreground">
                    Anyone can access this workspace
                  </span>
                </div>
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {permission === "public" && (
          <div className="flex flex-col gap-4">
            <CollabSearch
              existingCollaborators={collaborators}
              setCollaborators={(user: CollaboratorUser) => {
                setCollaborators((prev) => [...prev, user]);
              }}
            >
              <Button
                variant={"secondary"}
                className="flex items-center gap-2 cursor-pointer justify-start w-min"
              >
                <Plus />
                Add Collaborators
              </Button>
            </CollabSearch>

            {collaborators.length > 0 && (
              <div>
                <Label className="text-sm font-medium">
                  Added Collaborators:
                </Label>
                <ScrollArea className="h-[200px] w-full mt-2 border rounded-md p-2">
                  {collaborators.map((collaborator) => (
                    <div
                      key={collaborator.userId}
                      className="flex items-center justify-between gap-2 p-2 hover:bg-muted/50 rounded"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">
                            {collaborator.email?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{collaborator.email}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCollaborator(collaborator)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </ScrollArea>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col gap-2 mt-4 border-red-500 border rounded-md p-4">
          <div className="flex flex-col justify-start  gap-2">
            <span className="text-sm font-medium">Delete workspace</span>
            <span className="text-sm text-red-500/50">
              This action is irreversible and will delete all files and folders
              in the workspace.
            </span>
          </div>
          <Button
            onClick={handleDeleteWorkspace}
            disabled={isLoading}
            className="w-full bg-red-800 text-white hover:bg-red-900 mt-4 cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Delete workspace"
            )}
          </Button>
        </div>

        <div className="flex justify-end mt-4">
          <Button
            onClick={handleUpdateWorkspace}
            disabled={permission === "public" && collaborators.length === 0}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Update workspace"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SettingsForms;
