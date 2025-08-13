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

interface EmojiPickerProps {
  children: React.ReactNode;
  getValue: (emoji: string) => void;
}

function EmojiPickers({ children, getValue }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
    const route = useRouter();

  return (
    <div className="flex items-center">
      <Popover onOpenChange={setIsOpen} open={isOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="text-4xl p-2 h-auto">
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
