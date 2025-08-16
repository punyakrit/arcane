export const dynamic = 'force-dynamic'
import QuillEditors from '@/components/quillEditor/QuillEditors'
import { getFileByIdQuill } from '@/lib/supabase/queries'
import { redirect } from 'next/navigation'
import React from 'react'

async function page({params}:{params:{fileId:string, folderId:string, workspaceId:string}}) {
  const fileId = (await params).fileId
  const folderId = (await params).folderId
  const workspaceId = (await params).workspaceId
  const file = await getFileByIdQuill(fileId)
  if(!file){
    return redirect('/dashboard')
  }
  return (
    <div>
      <QuillEditors dirType="file" fileId={fileId} dirData={file || null}/>
    </div>
  )
}

export default page