export const dynamic = 'force-dynamic'
import { getWorkspaceById } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";
import React from "react";
import QuillEditors from "@/components/quillEditor/QuillEditors";

async function page({ params }: { params: { workspaceId: string } }) {
  const id = (await params).workspaceId;
  const respsone = await getWorkspaceById(id);
  if (!respsone || respsone.data?.length === 0) {
    return redirect("/dashboard");
  }

  return (
    <div className="relative">
      <QuillEditors dirType="workspace" fileId={id} dirData={respsone || null}/>
    </div>
  );
}

export default page;
