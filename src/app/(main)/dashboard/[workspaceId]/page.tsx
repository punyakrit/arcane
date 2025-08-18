export const dynamic = 'force-dynamic'
import React from "react";
import QuillEditors from "@/components/quillEditor/quillEditors";

async function page({ params }: { params: { workspaceId: string } }) {
  const id = (await params).workspaceId;

  return (
    <div className="relative">
      <QuillEditors dirType="workspace" fileId={id} />
    </div>
  );
}

export default page;
