"use server"

import { Files, Folders, WorkSpace } from "@prisma/client"
import { prisma } from "./db"
import { createClient } from "./server"


export async function getFolderById(workspaceId: string) {
    try {
        const supabase = await createClient()
        const response = await prisma.folders.findMany({
            where: {
                workSpaceId: workspaceId
            },
            select: {
                id: true,
                title: true,
                iconId: true,
                data: true,
                inTrash: true,
                bannerUrl: true,
                workSpaceId: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: "asc"
            }
        })
        return {
            folder: response,
            errorFolder: null
        }
    } catch (e) {
        return {
            folder: null,
            errorFolder: e
        }
    }
}


export async function getPrivateWorkspace(userId: string) {
    try {
        const collaboratorWorkspaceIds = await prisma.collaborators.findMany({
            where: {
                userId: userId
            },
            select: {
                workSpaceId: true
            }
        })

        const collaboratorIds = collaboratorWorkspaceIds.map(c => c.workSpaceId)

        const privateWorkspace = await prisma.workSpace.findMany({
            where: {
                workSpaceOwner: userId,
                id: {
                    notIn: collaboratorIds
                },

            },
            select: {
                id: true,
                title: true,
                iconId: true,
                workSpaceOwner: true,
                createdAt: true,
                data: true,
                inTrash: true
            },
            orderBy: {
                createdAt: "asc"
            }
        })
        return {
            privateWorkspace: privateWorkspace,
        }
    } catch (e) {
        return {
            privateWorkspace: null,
        }
    }
}


export async function getCollaboratorsWorkspace(user_id: string) {
    try {
        const collaborators = await prisma.collaborators.findMany({
            where: {
                userId: user_id
            },
            select: {
                workSpaceId: true,
                workSpace: {
                    select: {
                        id: true,
                        title: true,
                        iconId: true,
                        workSpaceOwner: true,
                        createdAt: true,
                        data: true,
                        inTrash: true
                    }
                }
            },
            orderBy: {
                workSpace: {
                    createdAt: "asc"
                }
            }
        })
        return {
            collaborators: collaborators,
        }
    } catch (e) {
        return {
            collaborators: null,
        }
    }
}


export async function getSupabaseUserSearch(email: string) {
    const users = await prisma.user.findMany({
        where: {
            email: {
                contains: email,
            }
        },
        take: 5,
    })
    return users
}


export async function createFolder(folder: Folders) {
    try {
        const newFolder = await prisma.folders.create({
            data: folder
        })
    return {
            error: null,
            result: newFolder
        }
    } catch (e) {
        return {
            error: e,
            result: null
        }
    }
}

export async function updateFolder(folder: Partial<Folders>, folderId: string) {
    try{
        const updatedFolder = await prisma.folders.update({
            where: {
                id: folderId
            },
            data: folder
        })
        return {
            error: null,
            result: updatedFolder
        }
    } catch (e) {
        return {
            error: e,
            result: null
        }
    }
}

export async function createFile(file: Files) {
    try {
        const newFile = await prisma.files.create({
            data: file
        })
        return {
            error: null,
            result: newFile
        }
    } catch (e) {
        return {
            error: e,
            result: null
        }
    }
}


export async function getFilesByFolderId(folderId: string) {
    try {
        const files = await prisma.files.findMany({
            where: {
                folderId: folderId
            },
            select: {
                id: true,
                title: true,
                iconId: true,
                data: true,
                createdAt: true,
                folderId: true,
                inTrash: true,
                bannerUrl: true
            }
        })
        return {
            error: null,
            result: files
        }
    } catch (e) {
        return {
            error: e,
            result: null
        }
    }
}

export async function updateFile(file: Partial<Files>, fileId: string) {
    try {
        const updatedFile = await prisma.files.update({
            where: {
                id: fileId
            },
            data: file
        })
        return {
            error: null,
            result: updatedFile
        }
    } catch (e) {
        return {
            error: e,
            result: null
        }
    }
}


export async function deleteFolder(folderId: string) {
    try {
        const deletedFolder = await prisma.folders.delete({
            where: {
                id: folderId
            }
        })
        return {
            error: null,
            result: deletedFolder
        }
    } catch (e) {
        return {
            error: e,
            result: null
        }
    }
}

export async function deleteFiles(fileId: string) {
    try {
        const deletedFile = await prisma.files.delete({
            where: {
                id: fileId
            }
        })
        return {
            error: null,
            result: deletedFile
        }
    } catch (e) {
        return {
            error: e,
            result: null
        }
    }
}


export async function updateFileById(fileId: string, file: Partial<Files>) {
    try {
        const updatedFile = await prisma.files.update({
            where: {
                id: fileId
            },
            data: file
        })
        return {
            error: null,
            result: updatedFile
        }
    } catch (e) {
        return {
            error: e,
            result: null
        }
    }
}


export async function getWorkspaceDetails(workspaceId: string) {
    const workspace = await prisma.workSpace.findUnique({
        where: {
            id: workspaceId
        }
    })
    return workspace
}


export async function updateWorkspaceDetails(workspaceId: string, data: Partial<WorkSpace>) {
    const workspace = await prisma.workSpace.update({
        where: {
            id: workspaceId
        },
        data: data
    })
    return workspace
}

export async function getWorkspaceCollaborators(workspaceId: string) {
    try {
        const collaborators = await prisma.collaborators.findMany({
            where: {
                workSpaceId: workspaceId
            },
            select: {
                id: true,
                userId: true,
                createdAt: true
            }
        })
        return {
            error: null,
            result: collaborators
        }
    } catch (e) {
        return {
            error: e,
            result: null
        }
    }
}

export async function getUserById(userId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                userId: userId
            },
            select: {
                id: true,
                email: true,
                userId: true,
                createdAt: true
            }
        })
        
        if (!user) {
            return {
                error: "User not found",
                result: null
            }
        }
        
        return {
            error: null,
            result: user
        }
    } catch (e) {
        return {
            error: e,
            result: null
        }
    }
}

export async function getPrismaUserBySupabaseId(supabaseUserId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                userId: supabaseUserId
            },
            select: {
                id: true,
                email: true,
                userId: true,
                createdAt: true
            }
        })
        
        if (!user) {
            return {
                error: "User not found",
                result: null
            }
        }
        
        return {
            error: null,
            result: user
        }
    } catch (e) {
        return {
            error: e,
            result: null
        }
    }
}

export async function removeCollaboratorFromWorkspace(workspaceId: string, collaboratorId: string) {

    const respsone = await prisma.collaborators.delete({
        where: {
            id: collaboratorId,
            workSpaceId: workspaceId
        }
    })
    return respsone
}

export async function deleteWorkspace(workspaceId: string) {
    const respsone = await prisma.workSpace.delete({
        where: {
            id: workspaceId
        }
    })
    return respsone
}