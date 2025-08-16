"use client";
import { User } from "@prisma/client";
import React, { useEffect, useRef, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Plus, Search } from "lucide-react";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { createClient } from "@/lib/supabase/client";
import { getSupabaseUserSearch } from "@/lib/supabase/queries";

interface CollabSearchProps {
  existingCollaborators: User[];
  setCollaborators: (collaborators: User) => void;
  children: React.ReactNode;
}

function CollabSearch({
  existingCollaborators,
  setCollaborators,
  children,
}: CollabSearchProps) {
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [search, setSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);


  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  

  const onChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    
    if(timerRef.current){
        clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(async ()=>{
        const res = await getSupabaseUserSearch(value)

        if(res){
            setSearchResults(res)
        }
    }, 500);
  };

  const handleAddCollaborator = (collaborator: User) => {
        setCollaborators(collaborator);
  };

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent className="w-[400px] sm:w-[600px]">
          <SheetHeader>
            <SheetTitle>Search for collaborators</SheetTitle>
            <SheetDescription>
              <p>
                Search for collaborators to add and remove from your workspace
              </p>
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-4 mt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Email"
                value={search}
                onChange={onChangeHandler}
                autoComplete="off"
                className="pl-10 border-purple-500/20 focus:border-purple-500"
              />
            </div>
            
            <ScrollArea className="h-[300px]">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-muted-foreground">Searching...</div>
                </div>
              ) : searchResults.length > 0 ? (
                searchResults
                  .filter((user) => !existingCollaborators.some(collab => collab.userId === user.userId))
                  .map((user) => (
                    <div
                      key={user.userId}
                      className="p-4 flex items-center justify-between w-full hover:bg-muted/50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-muted text-muted-foreground">
                            {user.email?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-sm font-medium">
                          {user.email}
                        </div>
                      </div>
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => handleAddCollaborator(user)}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </Button>
                    </div>
                  ))
              ) : search && !isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-muted-foreground">No users found</div>
                </div>
              ) : null}
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

export default CollabSearch;
