"use client";
import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
import "quill/dist/quill.snow.css";
import { Files, Folders, WorkSpace } from "@prisma/client";
import { usePathname } from "next/navigation";
import { getWorkspaceById, getFolderByIdQuill, getFileByIdQuill } from "@/lib/supabase/queries";

interface quillEditorsProps {
  dirType: "workspace" | "folder" | "file";
  fileId: string;
  dirData: WorkSpace | Folders | Files;
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

function quillEditors({ dirType, fileId, dirData }: quillEditorsProps) {
  const [quillEditor, setQuillEditor] = useState<any>(null);
  const [breadcrumbData, setBreadcrumbData] = useState<{
    workspace?: WorkSpace;
    folder?: Folders;
    file?: Files;
  }>({});
  const pathname = usePathname();

  useEffect(() => {
    const fetchBreadcrumbData = async () => {
      if (!pathname) return;
      
      const segments = pathname
        .split("/")
        .filter((item) => item !== "dashboard" && item);

      if (segments.length === 0) return;

      const newBreadcrumbData: {
        workspace?: WorkSpace;
        folder?: Folders;
        file?: Files;
      } = {};

      if (segments.length >= 1) {
        const workspace = await getWorkspaceById(segments[0]);
        if (workspace) newBreadcrumbData.workspace = workspace;
      }

      if (segments.length >= 2) {
        const folder = await getFolderByIdQuill(segments[1]);
        if (folder) newBreadcrumbData.folder = folder;
      }

      if (segments.length >= 3) {
        const file = await getFileByIdQuill(segments[2]);
        if (file) newBreadcrumbData.file = file;
      }

      setBreadcrumbData(newBreadcrumbData);
    };

    fetchBreadcrumbData();
  }, [pathname]);

  const breadcrumbs = useMemo(() => {
    if (!pathname) return null;
    
    const segments = pathname
      .split("/")
      .filter((item) => item !== "dashboard" && item);

    if (segments.length === 0) return null;

    const breadcrumbParts = [];

    if (breadcrumbData.workspace) {
      breadcrumbParts.push(`${breadcrumbData.workspace.iconId} ${breadcrumbData.workspace.title}`);
    }

    if (breadcrumbData.folder) {
      breadcrumbParts.push(`${breadcrumbData.folder.iconId} ${breadcrumbData.folder.title}`);
    }

    if (breadcrumbData.file) {
      breadcrumbParts.push(`${breadcrumbData.file.iconId} ${breadcrumbData.file.title}`);
    }

    return breadcrumbParts.join(" / ");
  }, [pathname, breadcrumbData]);

  const details = useMemo(() => {
    let selectedDir;
    if (dirType === "file") {
      selectedDir = dirData as Files;
    }
    if (dirType === "folder") {
      selectedDir = dirData as Folders;
    }
    if (dirType === "workspace") {
      selectedDir = dirData as WorkSpace;
    }

    if (selectedDir) {
      return selectedDir;
    }

    return {
      title: dirData?.title,
      icon: dirData?.iconId,
      createdAt: dirData?.createdAt,
      data: dirData?.data,
      bannerUrl: dirData?.bannerUrl,
    };
  }, [dirType, dirData]);

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
