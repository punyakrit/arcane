"use client";
import { User } from "@supabase/supabase-js";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import EmojiPickers from "../global/EmojiPicker";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { createWorkspace } from "@/actions/workspace";

interface DashboardSetupProps {
  user: User;
  subscription: any | null;
}

function DashboardSetup({ user, subscription }: DashboardSetupProps) {
  const [selectedEmoji, setSelectedEmoji] = useState("💼");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      await createWorkspace(formData, user, selectedEmoji);
    } catch (err) {
      setError("Failed to create workspace");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-[800px] h-screen sm:h-auto ">
      <CardHeader>
        <CardTitle>Create your workspace</CardTitle>
        <CardDescription>
          Create your workspace to get started with your project.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="text-5xl">
                <EmojiPickers getValue={(emoji) => setSelectedEmoji(emoji)}>
                  {selectedEmoji}
                </EmojiPickers>
              </div>
              <div className="w-full">
                <Label
                  htmlFor="workspace-name"
                  className=" text-sm text-muted-foreground"
                >
                  Name
                </Label>
                <Input
                  id="workspace-name"
                  name="workspace-name"
                  type="text"
                  placeholder="Workspace Name"
                  className="mt-2"
                  required
                />
              </div>
            </div>
            <div className="w-full">
              <Label
                htmlFor="workspace-logo"
                className=" text-sm text-muted-foreground"
              >
                Workspace Logo
              </Label>
              <Input
                id="workspace-logo"
                name="workspace-logo"
                type="file"
                accept="image/*"
                placeholder="Workspace Logo"
                className="mt-2"
                disabled={subscription?.status !== "active"}
                required
              />
              <small className="text-xs text-muted-foreground">
                To customize your workspace logo, please upgrade to a paid plan.
              </small>
              <div>

              <small className="text-sm text-red-500">{error}</small>
              </div>
              <div className=" flex justify-end ">
                <Button type="submit" className=" mt-4 lg:w-[20%]" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Workspace"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default DashboardSetup;
