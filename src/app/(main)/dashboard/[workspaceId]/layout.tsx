import React from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import { WorkspaceProvider } from "@/lib/provider/workspace-provider";

interface LayoutProps {
  children: React.ReactNode;
  params: { workspaceId: string };
}

async function layout({ children, params }: LayoutProps) {
  const workspaceId = (await params).workspaceId;
  
  return (
    <WorkspaceProvider initialWorkspaceId={workspaceId}>
      <main className="flex overflow-hidden h-screen w-screen ">
        <Sidebar params={{ workspaceId }} />
        <div className="dark:border-neutral-500/70 border-l-[1px] w-full relative overflow-scroll">
          {children}
        </div>
      </main>
    </WorkspaceProvider>
  );
}

export default layout;
