"use client"
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Plus } from 'lucide-react';
import BannerUploadForm from './BannerUploadForm';
import { Button } from '../ui/button';

interface BannerUploadProps {
    dirType: "workspace" | "folder" | "file";
    fileId: string;
    children: React.ReactNode;
    className?: string;
}

function BannerUpload({ dirType, fileId, children, className }: BannerUploadProps) {
    const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className={className} variant="outline" >
          {children}
        </Button>
      </DialogTrigger>
      <DialogContent className=" overflow-full">
        <DialogHeader>
          <DialogTitle>Upload Banner</DialogTitle>
          <DialogDescription>
            Upload a banner for your {dirType}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
            <hr/>
          <BannerUploadForm setIsOpen={setIsOpen} dirType={dirType} fileId={fileId}/>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default BannerUpload