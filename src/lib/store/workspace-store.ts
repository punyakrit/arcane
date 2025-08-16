"use client";

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Files, Folders, WorkSpace } from '@prisma/client';
import {
  createFolder,
  createFile,
  updateFolder,
  updateFile,
  deleteFolder,
  deleteFiles,
  getFilesByFolderId,
  getFolderById,
  getWorkspaceById,
  updateWorkspaceDetails
} from '@/lib/supabase/queries';

export interface WorkspaceWithDetails extends WorkSpace {
  folders?: Folders[];
}

export interface FolderWithFiles extends Folders {
  files?: Files[];
}

interface WorkspaceState {
  currentWorkspace: WorkspaceWithDetails | null;
  workspaces: WorkSpace[];
  folders: FolderWithFiles[];
  files: Files[];
  breadcrumb: {
    workspace?: WorkSpace;
    folder?: Folders;
    file?: Files;
  };
  isLoading: boolean;
  error: string | null;
}

interface WorkspaceActions {
  setCurrentWorkspace: (workspace: WorkspaceWithDetails) => void;
  setWorkspaces: (workspaces: WorkSpace[]) => void;
  
  loadWorkspaceData: (workspaceId: string) => Promise<void>;
  
  addFolder: (folder: Folders) => Promise<void>;
  updateFolderInStore: (folderId: string, updates: Partial<Folders>) => Promise<void>;
  deleteFolderFromStore: (folderId: string) => Promise<void>;
  
  addFile: (file: Files) => Promise<void>;
  updateFileInStore: (fileId: string, updates: Partial<Files>) => Promise<void>;
  deleteFileFromStore: (fileId: string) => Promise<void>;
  
  updateWorkspaceInStore: (workspaceId: string, updates: Partial<WorkSpace>) => Promise<void>;
  
  setBreadcrumb: (breadcrumb: { workspace?: WorkSpace; folder?: Folders; file?: Files }) => void;
  
  loadFolderFiles: (folderId: string) => Promise<void>;
  
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  clearStore: () => void;
}

type WorkspaceStore = WorkspaceState & WorkspaceActions;

export const useWorkspaceStore = create<WorkspaceStore>()(
  devtools(
    (set, get) => ({
      currentWorkspace: null,
      workspaces: [],
      folders: [],
      files: [],
      breadcrumb: {},
      isLoading: false,
      error: null,

      setCurrentWorkspace: (workspace) => {
        set({ currentWorkspace: workspace }, false, 'setCurrentWorkspace');
      },

      setWorkspaces: (workspaces) => {
        set({ workspaces }, false, 'setWorkspaces');
      },

      loadWorkspaceData: async (workspaceId: string) => {
        set({ isLoading: true, error: null });
        try {
          const workspace = await getWorkspaceById(workspaceId);
          if (workspace) {
            const { folder: folders } = await getFolderById(workspaceId);
            
            let allFiles: Files[] = [];
            if (folders) {
              for (const folder of folders) {
                const { result: files } = await getFilesByFolderId(folder.id);
                if (files) {
                  allFiles = [...allFiles, ...files];
                }
              }
            }

            const foldersWithFiles: FolderWithFiles[] = folders?.map(folder => ({
              ...folder,
              files: allFiles.filter(file => file.folderId === folder.id)
            })) || [];

            set({
              currentWorkspace: { ...workspace, folders: folders || [] },
              folders: foldersWithFiles,
              files: allFiles,
              breadcrumb: { workspace },
              isLoading: false
            }, false, 'loadWorkspaceData');
          }
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to load workspace data', isLoading: false });
        }
      },

      addFolder: async (folder: Folders) => {
        try {
          const { error, result } = await createFolder(folder);
          if (error) {
            throw new Error('Failed to create folder');
          }
          if (result) {
            const newFolderWithFiles: FolderWithFiles = { ...result, files: [] };
            set(state => ({
              folders: [newFolderWithFiles, ...state.folders],
              currentWorkspace: state.currentWorkspace ? {
                ...state.currentWorkspace,
                folders: [result, ...(state.currentWorkspace.folders || [])]
              } : null
            }), false, 'addFolder');
          }
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to add folder' });
        }
      },

      updateFolderInStore: async (folderId: string, updates: Partial<Folders>) => {
        try {
          const { error, result } = await updateFolder(updates, folderId);
          if (error) {
            throw new Error('Failed to update folder');
          }
          if (result) {
            set(state => {
              const updatedFolders = state.folders.map(folder =>
                folder.id === folderId ? { ...folder, ...updates } : folder
              );
              
              return {
                folders: updatedFolders,
                currentWorkspace: state.currentWorkspace ? {
                  ...state.currentWorkspace,
                  folders: state.currentWorkspace.folders?.map(folder =>
                    folder.id === folderId ? { ...folder, ...updates } : folder
                  )
                } : null,
                breadcrumb: folderId === state.breadcrumb.folder?.id ? {
                  ...state.breadcrumb,
                  folder: { ...state.breadcrumb.folder, ...updates }
                } : state.breadcrumb
              };
            }, false, 'updateFolderInStore');
          }
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to update folder' });
        }
      },

      deleteFolderFromStore: async (folderId: string) => {
        try {
          const { error } = await deleteFolder(folderId);
          if (error) {
            throw new Error('Failed to delete folder');
          }
          
          set(state => ({
            folders: state.folders.filter(folder => folder.id !== folderId),
            files: state.files.filter(file => file.folderId !== folderId),
            currentWorkspace: state.currentWorkspace ? {
              ...state.currentWorkspace,
              folders: state.currentWorkspace.folders?.filter(folder => folder.id !== folderId)
            } : null
          }), false, 'deleteFolderFromStore');
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to delete folder' });
        }
      },

      addFile: async (file: Files) => {
        try {
          const { error, result } = await createFile(file);
          if (error) {
            throw new Error('Failed to create file');
          }
          if (result) {
            set(state => {
              const updatedFolders = state.folders.map(folder =>
                folder.id === file.folderId
                  ? { ...folder, files: [result, ...(folder.files || [])] }
                  : folder
              );
              
              return {
                files: [result, ...state.files],
                folders: updatedFolders
              };
            }, false, 'addFile');
          }
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to add file' });
        }
      },

      updateFileInStore: async (fileId: string, updates: Partial<Files>) => {
        try {
          const { error, result } = await updateFile(updates, fileId);
          if (error) {
            throw new Error('Failed to update file');
          }
          if (result) {
            set(state => {
              const updatedFiles = state.files.map(file =>
                file.id === fileId ? { ...file, ...updates } : file
              );
              
              const updatedFolders = state.folders.map(folder => ({
                ...folder,
                files: folder.files?.map(file =>
                  file.id === fileId ? { ...file, ...updates } : file
                )
              }));
              
              return {
                files: updatedFiles,
                folders: updatedFolders,
                breadcrumb: fileId === state.breadcrumb.file?.id ? {
                  ...state.breadcrumb,
                  file: { ...state.breadcrumb.file, ...updates }
                } : state.breadcrumb
              };
            }, false, 'updateFileInStore');
          }
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to update file' });
        }
      },

      deleteFileFromStore: async (fileId: string) => {
        try {
          const { error } = await deleteFiles(fileId);
          if (error) {
            throw new Error('Failed to delete file');
          }
          
          set(state => {
            const updatedFiles = state.files.filter(file => file.id !== fileId);
            const updatedFolders = state.folders.map(folder => ({
              ...folder,
              files: folder.files?.filter(file => file.id !== fileId)
            }));
            
            return {
              files: updatedFiles,
              folders: updatedFolders
            };
          }, false, 'deleteFileFromStore');
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to delete file' });
        }
      },

      updateWorkspaceInStore: async (workspaceId: string, updates: Partial<WorkSpace>) => {
        try {
          const result = await updateWorkspaceDetails(workspaceId, updates);
          if (result) {
            set(state => ({
              currentWorkspace: state.currentWorkspace?.id === workspaceId ? {
                ...state.currentWorkspace,
                ...updates
              } : state.currentWorkspace,
              workspaces: state.workspaces.map(workspace =>
                workspace.id === workspaceId ? { ...workspace, ...updates } : workspace
              ),
              breadcrumb: workspaceId === state.breadcrumb.workspace?.id ? {
                ...state.breadcrumb,
                workspace: { ...state.breadcrumb.workspace, ...updates }
              } : state.breadcrumb
            }), false, 'updateWorkspaceInStore');
          }
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to update workspace' });
        }
      },

      setBreadcrumb: (breadcrumb) => {
        set({ breadcrumb }, false, 'setBreadcrumb');
      },

      loadFolderFiles: async (folderId: string) => {
        try {
          const { error, result } = await getFilesByFolderId(folderId);
          if (error) {
            throw new Error('Failed to load folder files');
          }
          if (result) {
            set(state => {
              const newFiles = result.filter(file => 
                !state.files.some(existingFile => existingFile.id === file.id)
              );
              
              const updatedFolders = state.folders.map(folder =>
                folder.id === folderId
                  ? { ...folder, files: result }
                  : folder
              );
              
              return {
                files: [...state.files.filter(file => file.folderId !== folderId), ...result],
                folders: updatedFolders
              };
            }, false, 'loadFolderFiles');
          }
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to load folder files' });
        }
      },

      setLoading: (loading) => {
        set({ isLoading: loading }, false, 'setLoading');
      },

      setError: (error) => {
        set({ error }, false, 'setError');
      },

      clearStore: () => {
        set({
          currentWorkspace: null,
          workspaces: [],
          folders: [],
          files: [],
          breadcrumb: {},
          isLoading: false,
          error: null
        }, false, 'clearStore');
      }
    }),
    {
      name: 'workspace-store',
    }
  )
);
