import React from "react";
import Sidebar from "@/components/sidebar/Sidebar";

interface LayoutProps {
  children: React.ReactNode;
  params: any;
}

function layout({ children, params }: LayoutProps) {
  return (
    <main className="flex overflow-hidden h-screen w-screen ">
      <Sidebar params={params} />
      <div className="dark:border-neutral-500/70 border-l-[1px] w-full relative overflow-scroll">
      {children}

      </div>
    </main>
  );
}

export default layout;
