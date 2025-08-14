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
import { Lock, Users } from "lucide-react";
import { Button } from "../ui/button";

function WorkspaceCreator() {
  const [permission, setPermission] = useState<"public" | "private">("private");
  const [title, setTitle] = useState("");
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const [users, setUsers] = useState<any[]>([]);


  function handleCreateWorkspace(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(title, permission, collaborators);
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
        <div className="flex justify-end mt-4">
          <Button
          
            type="submit"
            disabled={
              !title || (permission === "public" && collaborators.length === 0)
            }
          >
            Create workspace
          </Button>
        </div>
      </div>
    </div>
  );
}

export default WorkspaceCreator;
