"use server";

import { User } from "@supabase/supabase-js";
import { prisma } from "@/lib/supabase/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createWorkspace(
  formData: FormData,
  user: User,
  selectedEmoji: string
) {
  const supabase = createClient();
  const workspaceName = formData.get("workspace-name") as string;
  const workspaceLogo = formData.get("workspace-logo") as any;
  const workspaceId = crypto.randomUUID();
  let imageUrl = null;
  

  const workspace = await prisma.workSpace.create({
    data: {
      id: workspaceId,
      title: workspaceName,
      workSpaceOwner: user.id,
      iconId: selectedEmoji,
    }
  });
  revalidatePath("/");
  redirect(`/dashboard/${workspaceId}`);
  return workspace;
} 