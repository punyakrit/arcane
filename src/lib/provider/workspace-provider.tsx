"use client";

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useWorkspaceStore } from '@/lib/store/workspace-store';
import { usePathname } from 'next/navigation';

interface WorkspaceProviderProps {
  children: ReactNode;
  initialWorkspaceId?: string;
}

const WorkspaceContext = createContext<null>(null);

export function WorkspaceProvider({ children, initialWorkspaceId }: WorkspaceProviderProps) {
  const { loadWorkspaceData, setBreadcrumb, setError } = useWorkspaceStore();
  const pathname = usePathname();

  useEffect(() => {
    if (initialWorkspaceId) {
      loadWorkspaceData(initialWorkspaceId);
    }
  }, [initialWorkspaceId, loadWorkspaceData]);

  useEffect(() => {
    const updateBreadcrumbFromPath = async () => {
      if (!pathname || !pathname.includes('/dashboard/')) return;
      
      try {
        const segments = pathname
          .split('/')
          .filter(segment => segment && segment !== 'dashboard');

        if (segments.length === 0) return;

        const workspaceId = segments[0];
        const folderId = segments[1];
        const fileId = segments[2];

        const { getWorkspaceById, getFolderByIdQuill, getFileByIdQuill } = await import('@/lib/supabase/queries');

        const breadcrumbData: {
          workspace?: any;
          folder?: any; 
          file?: any;
        } = {};

        if (workspaceId) {
          const workspace = await getWorkspaceById(workspaceId);
          if (workspace) breadcrumbData.workspace = workspace;
        }

        if (folderId) {
          const folder = await getFolderByIdQuill(folderId);
          if (folder) breadcrumbData.folder = folder;
        }

        if (fileId) {
          const file = await getFileByIdQuill(fileId);
          if (file) breadcrumbData.file = file;
        }

        setBreadcrumb(breadcrumbData);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to update breadcrumb');
      }
    };

    updateBreadcrumbFromPath();
  }, [pathname, setBreadcrumb, setError]);

  return (
    <WorkspaceContext.Provider value={null}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export const useWorkspaceContext = () => {
  const context = useContext(WorkspaceContext);
  return context;
};
