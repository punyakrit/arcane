
import DashboardSetup from "@/components/dashboard/DashboardSetup";
import { prisma } from "@/lib/supabase/db";
import { getUserSubscription } from "@/lib/supabase/queries";
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

  const { subscription, error } = await getUserSubscription(user.id as string);
  if (error) {
    return <div>{JSON.stringify(error)}</div>;
  }

  if (!workspace) {
    return (
      <div className="bg-background flex justify-center items-center h-screen w-screen">
        <DashboardSetup user={user} subscription={subscription} />
      </div>
    );
  }

  redirect(`/dashboard/${workspace.id}`);
  return <div>{JSON.stringify(workspace)}</div>;
}

export default page;
