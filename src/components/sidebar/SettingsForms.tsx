"use client"
import { getSupabaseUser } from '@/lib/provider/getSupabaseUser';
import { Briefcase } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react'
import { SelectSeparator } from '../ui/select';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

interface SettingsFormsProps {
    workspaceId: string
}

function SettingsForms({ workspaceId }: SettingsFormsProps) {
    const [permissions, setPermissions] = useState<string[]>([]);
    const [collaborators, setCollaborators] = useState<string[]>([]);
    const [openAlertMessage, setOpenAlertMessage] = useState(false);
    const [workspaceDetails, setWorkspaceDetails] = useState(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter(); 
    
  return (
    <div className='flex gap-4 flex-col'>
        <p className='flex gap-2 mt-3 items-center'>
            <Briefcase className='w-4 h-4' />
            <span className='text-sm font-medium'>Workspace Details</span>
            <SelectSeparator/>
        </p>
        <div className='flex flex-col gap-2'>
            <Label>Name</Label>
            {/* <Input placeholder='Workspace Name' value={workspaceDetails?.name ?? ''}  /> */}
        </div>

    </div>
  )
}

export default SettingsForms