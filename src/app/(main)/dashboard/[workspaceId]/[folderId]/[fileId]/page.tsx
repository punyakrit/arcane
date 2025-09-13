export const dynamic = 'force-dynamic'
import QuillEditors from '@/components/quillEditor/quillEditors'
import React from 'react'

async function page({params}:{params:{fileId:string, folderId:string, workspaceId:string}}) {
  const fileId = (await params).fileId

  return (
    <div>
      <QuillEditors dirType="file" fileId={fileId} />
    </div>
  )
}

export default page