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
import { LogOut } from "lucide-react";
interface SidebarProps {
  params: { workspaceId: string };
  className?: string;
}

async function Sidebar({ params, className }: SidebarProps) {
  const { workspaceId } = params;
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
        <div className="mt-4">
          <div className="flex items-center justify-between rounded-full border px-3 py-2">
            <div className="text-sm truncate max-w-[180px]">{user.email}</div>
            <form
              action={async () => {
                "use server";
                const supabase = await createClient();
                await supabase.auth.signOut();
                redirect("/login");
              }}
            >
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full p-2 hover:bg-muted"
                aria-label="Log out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
