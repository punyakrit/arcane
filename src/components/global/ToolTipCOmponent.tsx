"use client"
import React from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface ToolTipCOmponentProps {
    message: string;
    children: React.ReactNode;
}

function ToolTipCOmponent({ message, children }: ToolTipCOmponentProps) {
  return (
    <TooltipProvider >
        <Tooltip>
            <TooltipTrigger>
                {children}
            </TooltipTrigger>
            <TooltipContent>
                {message}
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
  )
}

export default ToolTipCOmponent