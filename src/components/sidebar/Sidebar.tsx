import {
  getCollaboratorsWorkspace,
  getFolderById,
  getPrivateWorkspace,
  getUserSubscription,
} from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import React from "react";
import WorkspaceDropDown from "./WorkspaceDropDown";

interface SidebarProps {
  params: { workspaceId: string };
  className?: string;
}

async function Sidebar({ params, className }: SidebarProps) {
  const { workspaceId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }
  const { subscription, error } = await getUserSubscription(user.id);

  const { folder, errorFolder } = await getFolderById(workspaceId);

  if (errorFolder || error) {
    redirect("/dashboard");
  }

  const [privateWorkspace, collaborators] = await Promise.all([
    getPrivateWorkspace(user.id),
    getCollaboratorsWorkspace(user.id),
  ]);

  return (
    <aside
      className={`hidden sm:flex sm:flex-col w-[280px] shrink-0 p-4 md:gap-4 !justify-between ${className}`}
    >
      <div>
        <WorkspaceDropDown
          privateWorkspaces={privateWorkspace?.privateWorkspace ?? []}
          collaboratorsWorkspaces={collaborators?.collaborators ?? []}
          defaultWorkspace={[
            ...(privateWorkspace?.privateWorkspace ?? []),
            ...(collaborators?.collaborators?.filter(
              (collaborator: any) => collaborator.id === workspaceId
            ) ?? []),
          ]}
        />
      </div>
    </aside>
  );
}

export default Sidebar;
