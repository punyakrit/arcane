
import DashboardSetup from "@/components/dashboard/DashboardSetup";
import { prisma } from "@/lib/supabase/db";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import React from "react";

async function page() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }
  const workspace = await prisma.workSpace.findFirst({
    where: {
      workSpaceOwner: user.id as string,
    },
    select: {
      id: true,
    },
  });

  if (!workspace) {
    return (
      <div className="bg-background flex justify-center items-center h-screen w-screen">
        <DashboardSetup user={user}  />
      </div>
    );
  }

  redirect(`/dashboard/${workspace.id}`);
}

export default page;
