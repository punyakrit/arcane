"use client";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPickerSearch,
} from "../ui/emoji-picker";
import { Button } from "../ui/button";
import clsx from "clsx";

interface EmojiPickerProps {
  children: React.ReactNode;
  getValue: (emoji: string) => void;
  size?: "sm" | "md" | "lg";
}

function EmojiPickers({ children, getValue, size }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
    const route = useRouter();

  return (
    <div className="flex items-center">
      <Popover onOpenChange={setIsOpen} open={isOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className={clsx("text-3xl p-2 h-auto", {
            "text-sm": size === "sm",
            "text-md": size === "md",
            "text-lg": size === "lg",
          })}>
            {children}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit p-0">
          <EmojiPicker
            className="h-[300px]"
            onEmojiSelect={({ emoji }) => {
              setIsOpen(false);
              getValue(emoji);
            }}
          >
            <EmojiPickerSearch />
            <EmojiPickerContent />
            <EmojiPickerFooter />
          </EmojiPicker>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default EmojiPickers;
