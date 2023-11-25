"use client"

import { cn } from "@/lib/utils"
import { Member, MemberRole, Profile, Server } from "@prisma/client"
import { ShieldAlert, ShieldCheck } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { UserAvatar } from "../UserAvatar "

interface ServerMemberProps {
    member: Member & { profile: Profile },
    server: Server
}

const roleIocnMap = {
    [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
    [MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
    [MemberRole.GUEST]: null
}

export const ServerMember = ({ member, server }: ServerMemberProps) => {
    const params = useParams()
    const router = useRouter()

    return (
        <button className={cn("group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:bg-hover:bg-zinc-700 transition mb-1", params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700")}>
            <UserAvatar src={member.profile.imageUrl} className="h-8 w-8 md:h-8 md:w-8" />
            <p className={cn("font-semibold text-sm text-zinc-500", params.channelId === member.id && "text-primary dark:text-zinc-500")}>{member.profile.name}</p>
        </button>
    )
}
