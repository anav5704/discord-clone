"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from "lucide-react"
import { ServerWithMembersWithProfiles } from "@/types"
import { MemberRole } from "@prisma/client"

interface ServerHeaderProps {
    server: ServerWithMembersWithProfiles,
    role?: MemberRole,
}


export const ServerHeader = ({ server, role }: ServerHeaderProps) => {
   const isAdmin = role === MemberRole.ADMIN
  const isModerator = isAdmin || role === MemberRole.MODERATOR
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none" asChild>
               <button className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-700 border-b-2 hover:bg-zinc-700/10 dark-hover:bg-zinc-700/50 transition">
                    {server.name}    
                    <ChevronDown className="ml-auto h-5 w-5"/>
                </button> 
            </DropdownMenuTrigger>
            <DropdownMenuContent className="dark:bg-[#1e1f22] w-56 mx-auto font-xs font-medium text-black dark:text-neutral-400 space-y-[2px] ">
                {isModerator && (
                    <DropdownMenuItem className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"> 
                        Invite People
                        <UserPlus className="ml-auto h-4 w-4"/>
                    </DropdownMenuItem>
                )}                
                {isAdmin && (
                    <DropdownMenuItem className=" px-3 py-2 text-sm cursor-pointer"> 
                        Server Settings
                        <Settings className="ml-auto h-4 w-4"/>
                    </DropdownMenuItem>
                )}                
                 {isAdmin && (
                    <DropdownMenuItem className=" px-3 py-2 text-sm cursor-pointer"> 
                        Manage Members
                        <Users className="ml-auto h-4 w-4"/>
                    </DropdownMenuItem>
                )} 
                {isModerator && (
                    <DropdownMenuItem className="0 px-3 py-2 text-sm cursor-pointer"> 
                        Create Channel
                        <PlusCircle className="ml-auto h-4 w-4"/>
                    </DropdownMenuItem>
                )}
                {isModerator && (
                    <DropdownMenuSeparator className="dark:bg-[#2b2d31] bg-[#f2f3f5]" />
                )}
                 {isAdmin && (
                    <DropdownMenuItem className="text-rose-500 dark:text-rose-500 px-3 py-2 text-sm cursor-pointer"> 
                        Delete Server
                        <Trash className="ml-auto h-4 w-4"/>
                    </DropdownMenuItem>
                )}
                  {!isAdmin && (
                    <DropdownMenuItem className="text-rose-500 dark:text-rose-500 px-3 py-2 text-sm cursor-pointer"> 
                        Leave Server
                        <LogOut className="ml-auto h-4 w-4"/>
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
