"use server";

import { User } from "@prisma/client";
import { prisma } from "@/lib/supabase/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { WorkSpace } from "@prisma/client";

export async function createWorkspace(
  formData: FormData,
  user: User,
  selectedEmoji: string
) {
  const workspaceName = formData.get("workspace-name") as string;
  const workspaceLogo = formData.get("workspace-logo") as any;
  const workspaceId = crypto.randomUUID();
  let imageUrl = null;
  

  const workspace = await prisma.workSpace.create({
    data: {
      id: workspaceId,
      title: workspaceName,
      workSpaceOwner: user.userId,
      iconId: selectedEmoji,
    }
  });
  revalidatePath("/");
  redirect(`/dashboard/${workspaceId}`);
  return workspace;
} 


export const createWorkspaceDirect = async (workspace: WorkSpace) => {
  const response = await prisma.workSpace.create({
    data: workspace,
  });
  return response;
};


export const addCollaborator = async (collaborators: User[], workspaceId: string) => {
  const response = collaborators.forEach(async (user: User) => {
    const userExists = await prisma.collaborators.findFirst({
      where:{
        userId: user.userId,
        workSpaceId: workspaceId,
      }
    })
    if (!userExists) {
      const response = await prisma.collaborators.create({
        data: {
          userId: user.userId,
          workSpaceId: workspaceId,
        },
      });
    }
  })
  return response;
}