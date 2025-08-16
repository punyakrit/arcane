export const dynamic = 'force-dynamic'
import QuillEditors from '@/components/quillEditor/QuillEditors'
import { getFolderByIdQuill } from '@/lib/supabase/queries'
import { redirect } from 'next/navigation'
import React from 'react'

async function page({params}:{params:{folderId:string, workspaceId:string}}) {
  const folderId = (await params).folderId
  const workspaceId = (await params).workspaceId
  const folder = await getFolderByIdQuill(folderId)
  if(!folder){
    return redirect('/dashboard')
  }
  return (
    <div>
      <QuillEditors dirType="folder" fileId={folderId} dirData={folder || null}/>
    </div>
  )
}

export default page