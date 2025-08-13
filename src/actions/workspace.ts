"use server";

import { User } from "@supabase/supabase-js";
import { prisma } from "@/lib/supabase/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createWorkspace(
  formData: FormData,
  user: User,
  selectedEmoji: string
) {
  const workspaceName = formData.get("workspace-name") as string;
  const workspaceLogo = formData.get("workspace-logo") as any;
  const workspaceId = crypto.randomUUID();
  const workspace = await prisma.workSpace.create({
    data: {
      id: workspaceId,
      title: workspaceName,
      workSpaceOwner: user.id,
      iconId: selectedEmoji,
      logoUrl: workspaceLogo,
    }
  });
  revalidatePath("/");
  redirect(`/dashboard/${workspaceId}`);
  return workspace;
} 