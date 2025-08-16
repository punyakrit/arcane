export const dynamic = 'force-dynamic'
import QuillEditors from '@/components/quillEditor/QuillEditors'
import React from 'react'

async function page({params}:{params:{folderId:string, workspaceId:string}}) {
  const folderId = (await params).folderId

  return (
    <div>
      <QuillEditors dirType="folder" fileId={folderId} />
    </div>
  )
}

export default page