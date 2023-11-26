"use client"

import { cn } from "@/lib/utils"
import { Channel, ChannelType, MemberRole, Server } from "@prisma/client"
import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { ActionTooltip } from "../ui/ActionTooltip"
import { useModal } from "@/hooks/useModal"

interface ServerChannelProps {
    channel: Channel,
    server: Server,
    role?: MemberRole
}

const iconMap = {
    [ChannelType.TEXT]: <Hash className="flex-shrink-0 h-5 w-5 text-zinc-500" />,
    [ChannelType.AUDIO]: <Mic className="flex-shrink-0 h-5 w-5 text-zinc-500" />,
    [ChannelType.VIDEO]: <Video className="flex-shrink-0 h-5 w-5 text-zinc-500" />,
}

export const ServerChannel = ({ channel, server, role }: ServerChannelProps) => {
    const { onOpen } = useModal()
    const params = useParams()
    const router = useRouter()

    return (
        <button onClick={() => { }} className={cn("group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
            params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700"
        )}>
            {iconMap[channel.type]}
            <p className={cn("transition line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300",
                params?.channelId === channel.id && "text-primary  dark:text-zinc-200 dark:group-hover:text-white"
            )}>{channel.name}</p>
            {channel.name !== "General" && role !== MemberRole.GUEST && (
                <div className="ml-auto flex items-center gap-x-2">
                    <ActionTooltip label="Edit">
                        <Edit onClick={() => onOpen("editChannel", { server, channel })} className="h-4 w-4 hidden group-hover:block text-zinc-500" />
                    </ActionTooltip>
                    <ActionTooltip label="Delete">
                        <Trash onClick={() => onOpen("deleteChannel", { server, channel })} className="h-4 w-4 hidden group-hover:block text-zinc-500" />
                    </ActionTooltip>
                </div>
            )}
            {channel.name === "General" && (
                <Lock className="ml-auto h-4 w-4 text-zinc-500" />
            )}
        </button>
    )
}