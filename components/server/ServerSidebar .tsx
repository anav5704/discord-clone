import { currentProfile } from "@/lib/currentProfile"
import { ServerHeader } from "./ServerHeader"
import { ChannelType } from "@prisma/client"
import { redirect } from "next/navigation"
import { db } from "@/lib/prisma"

interface ServerSidebarProps {
    serverId: string
}

export const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
    const profile = await currentProfile()
    if (!profile) return redirect("/")

    const server = await db.server.findUnique({
        where: {
            id: serverId,
        },
        include: {
            channels: {
                orderBy: {
                    createdAt: "asc"
                }
            },
            members: {
                include: {
                    profile: true
                },
                orderBy: {
                    role: "asc"
                }
            }
        }
    })

    const textChannels = server?.channels.filter((channel) => channel.type === ChannelType.TEXT)
    const audioChannels = server?.channels.filter((channel) => channel.type === ChannelType.AUDIO)
    const videohannels = server?.channels.filter((channel) => channel.type === ChannelType.VIDEO)
    const memebers = server?.members.filter((member) => member.profileId !== profile.id)
    
    if(!server) return redirect("/")

    const role = server.members.find((member) => member.profileId === profile.id)?.role

    return (
        <div className="flex flex-col h-full w-full text-primary dark:bg-[#2b2d31] bg-[#f2f3f5]">
            <ServerHeader server={server} role={role} />
        </div>
    )
}
