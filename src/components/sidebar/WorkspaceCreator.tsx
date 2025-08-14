"use client"
import React, { useState } from 'react'

function WorkspaceCreator() {
    const [permission, setPermission] = useState<"public" | "private">("private")
    const [title, setTitle] = useState("")
    const [collaborators, setCollaborators] = useState<string[]>([])
    const [users, setUsers] = useState<any[]>([])
  return (
    <div>WorkspaceCreator</div>
  )
}

export default WorkspaceCreator