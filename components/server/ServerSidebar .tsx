import { ScrollArea } from "@/components/ui/scroll-area"
import { currentProfile } from "@/lib/currentProfile"
import { ServerSearch } from "./ServerSearch"
import { ServerHeader } from "./ServerHeader"
import { ChannelType, MemberRole } from "@prisma/client"
import { redirect } from "next/navigation"
import { db } from "@/lib/prisma"
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react"

interface ServerSidebarProps {
    serverId: string
}

const iconMap = {
    [ChannelType.TEXT]: <Hash className="h-4 w-4 mr-2" />,
    [ChannelType.AUDIO]: <Mic className="h-4 w-4 mr-2" />,
    [ChannelType.VIDEO]: <Video className="h-4 w-4 mr-2" />,
}

const roleIocnMap = {
    [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-55" />,
    [MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 mr-2 text-indigo-55" />,
    [MemberRole.GUEST]: null
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

    if (!server) return redirect("/")

    const role = server.members.find((member) => member.profileId === profile.id)?.role

    return (
        <div className="flex flex-col h-full w-full text-primary dark:bg-[#2b2d31] bg-[#f2f3f5]">
            <ServerHeader server={server} role={role} />
            <ScrollArea className="flex-1 px-3">
                <div className="mt-2">
                    <ServerSearch data={[
                        {
                            label: "Text channels",
                            type: "channel",
                            data: textChannels?.map((channel) => ({
                                id: channel.id,
                                name: channel.name,
                                icon: iconMap[channel.type]
                            }))
                        },
                        {
                            label: "Voice channels",
                            type: "channel",
                            data: audioChannels?.map((channel) => ({
                                id: channel.id,
                                name: channel.name,
                                icon: iconMap[channel.type]
                            }))
                        },
                        {
                            label: "Video channels",
                            type: "channel",
                            data: videohannels?.map((channel) => ({
                                id: channel.id,
                                name: channel.name,
                                icon: iconMap[channel.type]
                            }))
                        },
                        {
                            label: "Members",
                            type: "member",
                            data: memebers?.map((member) => ({
                                id: member.id,
                                name: member.profile.name,
                                icon: roleIocnMap[member.role]
                            }))
                        }
                    ]} />
                </div>
            </ScrollArea>
        </div>
    )
}
