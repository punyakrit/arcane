"use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "../ui/dialog";
import SettingsForms from './SettingsForms';
interface SettingsProps {
    children: React.ReactNode;
    workspaceId: string;    
}

function Settings({ children, workspaceId }: SettingsProps) {
    const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className=" overflow-full">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Manage your settings and preferences.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
            <hr/>
          <SettingsForms workspaceId={workspaceId} closeModal={() => setIsOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default Settings