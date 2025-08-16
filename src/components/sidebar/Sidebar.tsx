import {
  getCollaboratorsWorkspace,
  getFilesByFolderId,
  getFolderById,
  getPrivateWorkspace,
} from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import React from "react";
import WorkspaceDropDown from "./WorkspaceDropDown";
import NativeNavigation from "./NativeNavigation";
import { ScrollArea } from "../ui/scroll-area";
import FolderDropDownList from "./FolderDropDownList";
interface SidebarProps {
  params: { workspaceId: string };
  className?: string;
}

async function Sidebar({ params, className }: SidebarProps) {
  const { workspaceId } =await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  const { folder, errorFolder } = await getFolderById(workspaceId);


  if (errorFolder) {
    redirect("/dashboard");
  }

  const [privateWorkspace, collaborators] = await Promise.all([
    getPrivateWorkspace(user.id),
    getCollaboratorsWorkspace(user.id),
  ]);

  const collaboratorsWorkspaces = collaborators?.collaborators?.map((collaborator: any) => collaborator.workSpace) ?? [];

  return (
    <aside
      className={`hidden sm:flex sm:flex-col w-[280px] shrink-0 p-4 md:gap-4 !justify-between ${className}`}
    >
      <div className="flex flex-col h-full">
        <WorkspaceDropDown
          privateWorkspaces={privateWorkspace?.privateWorkspace ?? []}
          collaboratorsWorkspaces={collaboratorsWorkspaces}
          defaultWorkspace={[
            ...(privateWorkspace?.privateWorkspace ?? []),
            ...(collaboratorsWorkspaces.filter(
              (workspace: any) => workspace.id === workspaceId
            )),
          ]}
        />
        <hr className="my-4"/>
        <NativeNavigation workspaceId={workspaceId} />
        <hr className="my-4"/>
        <div className="flex-1 min-h-0">
          <FolderDropDownList workspaceId={workspaceId} />
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
