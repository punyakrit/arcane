"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { Label } from "../ui/label";

function CustomDialogTrigger() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="p-0 flex items-center gap-2 cursor-pointer h-10 w-full px-4">
          <Plus className="w-4 h-4" />
          <span className="text-sm underline-offset-4">Add workspace</span>
        </button>
      </DialogTrigger>
      <DialogContent className="h-screen sm:h-[440px] overflow-full">
        <DialogHeader>
          <DialogTitle>Create a new workspace</DialogTitle>
          <DialogDescription>
            Workspace gives you a place to organize your projects and tasks. You
            can create multiple workspaces to organize your projects and tasks.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Workspace name</Label>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CustomDialogTrigger;
