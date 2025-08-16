"use client";
import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
import "quill/dist/quill.snow.css";
import { Files, Folders, WorkSpace } from "@prisma/client";
import { useWorkspaceStore } from "@/lib/store/workspace-store";

interface quillEditorsProps {
  dirType: "workspace" | "folder" | "file";
  fileId: string;
}

var TOOLBAR_OPTIONS = [
  ["bold", "italic", "underline", "strike"],
  ["blockquote", "code-block"],

  [{ header: 1 }, { header: 2 }],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }],
  [{ indent: "-1" }, { indent: "+1" }],
  [{ direction: "rtl" }],

  [{ size: ["small", false, "large", "huge"] }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }],
  [{ font: [] }],
  [{ align: [] }],

  ["clean"],
];

function quillEditors({ dirType, fileId }: quillEditorsProps) {
  const [quillEditor, setQuillEditor] = useState<any>(null);
  const { breadcrumb, currentWorkspace, folders, files, updateWorkspaceInStore, updateFolderInStore, updateFileInStore } = useWorkspaceStore();

  const breadcrumbs = useMemo(() => {
    const breadcrumbParts = [];

    if (breadcrumb.workspace) {
      breadcrumbParts.push(`${breadcrumb.workspace.iconId || '📁'} ${breadcrumb.workspace.title}`);
    }

    if (breadcrumb.folder) {
      breadcrumbParts.push(`${breadcrumb.folder.iconId || '📁'} ${breadcrumb.folder.title}`);
    }

    if (breadcrumb.file) {
      breadcrumbParts.push(`${breadcrumb.file.iconId || '📄'} ${breadcrumb.file.title}`);
    }

    return breadcrumbParts.length > 0 ? breadcrumbParts.join(" / ") : null;
  }, [breadcrumb]);

  const currentData = useMemo(() => {
    if (dirType === "workspace") {
      return breadcrumb.workspace;
    }
    if (dirType === "folder") {
      return breadcrumb.folder;
    }
    if (dirType === "file") {
      return breadcrumb.file;
    }
    return null;
  }, [dirType, breadcrumb]);

  const handleContentChange = useCallback(async (content: string) => {
    if (!currentData) return;
    
    try {
      if (dirType === "workspace" && currentData.id) {
        await updateWorkspaceInStore(currentData.id, { data: content });
      } else if (dirType === "folder" && currentData.id) {
        await updateFolderInStore(currentData.id, { data: content });
      } else if (dirType === "file" && currentData.id) {
        await updateFileInStore(currentData.id, { data: content });
      }
    } catch (error) {
      console.error('Failed to save content:', error);
    }
  }, [currentData, dirType, updateWorkspaceInStore, updateFolderInStore, updateFileInStore]);

  // useEffect(() => {
  //   if (quillEditor && currentData?.data) {
  //     quillEditor.setContents(JSON.parse(currentData.data || '{}'));
  //   }
  // }, [quillEditor, currentData?.data]);

  // useEffect(() => {
  //   if (quillEditor) {
  //     const handler = () => {
  //       const content = JSON.stringify(quillEditor.getContents());
  //       handleContentChange(content);
  //     };
      
  //     quillEditor.on('text-change', handler);
  //     return () => {
  //       quillEditor.off('text-change', handler);
  //     };
  //   }
  // }, [quillEditor, handleContentChange]);

  const containerRef = useCallback(async (wrapper: HTMLDivElement) => {
    if (typeof window !== "undefined") {
      if (wrapper == null) return;

      wrapper.innerHTML = "";
      const editor = document.createElement("div");
      wrapper.append(editor);
      const quill = (await import("quill")).default;
      const quillEditor = new quill(editor, {
        theme: "snow",
        modules: {
          toolbar: TOOLBAR_OPTIONS,
        },
      });
      setQuillEditor(quillEditor);
    }
  }, []);

  return (
    <>
      <div className="flex flex-col-reverse sm:flex-row sm:justify-between justify-center sm:items-center sm:p-2 p-8">
        <div>{breadcrumbs}</div>
      </div>
      <div className="flex justify-center items-center flex-col mt-2 relative">
        <div id="container" ref={containerRef as any} className="w-max"></div>
      </div>
    </>
  );
}

export default quillEditors;
