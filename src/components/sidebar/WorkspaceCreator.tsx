"use client";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Lock, Loader2, Plus, Users } from "lucide-react";
import { Button } from "../ui/button";
import { createClient } from "@/lib/supabase/client";
import { generateUUID } from "@/lib/server-actions/exportuuid";
import { WorkSpace } from "@prisma/client";
import { addCollaborator, createWorkspaceDirect } from "@/actions/workspace";
import { useRouter } from "next/navigation";
import { User } from "@prisma/client";
import { getSupabaseUser } from "@/lib/provider/getSupabaseUser";
import { getPrismaUserBySupabaseId } from "@/lib/supabase/queries";
import CollabSearch from "./CollabSearch";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { toast } from "sonner";

function WorkspaceCreator({
  setIsOpen,
}: {
  setIsOpen: (isOpen: boolean) => void;
}) {
  const router = useRouter();
  const [permission, setPermission] = useState<"public" | "private">("private");
  const [title, setTitle] = useState("");
  const [collaborators, setCollaborators] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function handleCreateWorkspace() {
    setIsLoading(true);
    const supabaseUser = await getSupabaseUser();
    const id = await generateUUID();
    console.log(supabaseUser);
    if (supabaseUser) {
      const { result: user } = await getPrismaUserBySupabaseId(supabaseUser.id);
      if (!user) {
        toast.error("User not found");
        setIsLoading(false);
        return;
      }
      
      const workspace: WorkSpace = {
        id: id,
        title: title,
        workSpaceOwner: user.userId,
        iconId: "💼",
        createdAt: new Date(),
        inTrash: null,
        logoUrl: null,
        bannerUrl: null,
        data: null,
      };
      if (permission === "private") {
        const response = await createWorkspaceDirect(workspace);
        toast.success("Workspace created successfully");

        router.refresh();
      }
      if (permission === "public") {
        const response = await createWorkspaceDirect(workspace);
        const resposne2 = await addCollaborator(collaborators, id);
        toast.success("Workspace created successfully");

        router.refresh();
      }
    }
    setIsOpen(false);
    setIsLoading(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="workspace-name">Workspace name</Label>
        <Input
          id="workspace-name"
          type="text"
          placeholder="Enter workspace name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Collaborators</Label>
        <Select
          onValueChange={(value) =>
            setPermission(value as "public" | "private")
          }
          defaultValue={permission}
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
              setCollaborators={(user) => {
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
                <Label className="text-sm font-medium">Added Collaborators:</Label>
                <ScrollArea className="h-[200px] w-full mt-2 border rounded-md p-2">
                  {collaborators.map((collaborator) => (
                    <div key={collaborator.id} className="flex items-center gap-2 p-2 hover:bg-muted/50 rounded">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs">
                          {collaborator.email?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{collaborator.email}</span>
                    </div>
                  ))}
                </ScrollArea>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end mt-4">
          <Button
            onClick={handleCreateWorkspace}
            disabled={
              !title || (permission === "public" && collaborators.length === 0)
            }
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create workspace"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default WorkspaceCreator;
