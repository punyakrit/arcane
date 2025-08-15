"use server"

import { Folders } from "@prisma/client"
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