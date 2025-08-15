import { Home, LayoutDashboard, Settings, Trash } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Settingss from "./Settings";

interface NativeNavigationProps {
  workspaceId: string;
  className?: string;
}

function NativeNavigation({ workspaceId, className }: NativeNavigationProps) {
  return (
    <nav className={cn("my-2", className)}>
      <ul className="flex flex-col gap-2">
        <li>
          <Link
            href={`/dashboard/${workspaceId}`}
            className="group/native flex text-white/70 gap-2 items-center cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span className="text-sm">My Workspace</span>
          </Link>
        </li>
        <Settingss workspaceId={workspaceId}>

          <li
            className="group/native flex text-white/70 gap-2 items-center cursor-pointer"
            >
            <Settings className="w-4 h-4" />
            <span className="text-sm">Settings</span>
          </li>
        
            </Settingss>
      </ul>
    </nav>
  );
}

export default NativeNavigation;
