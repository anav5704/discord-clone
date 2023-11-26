import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChannelType, MemberRole } from "@prisma/client"
import { Separator } from "@/components/ui/separator"
import { currentProfile } from "@/lib/currentProfile"
import { ServerSection } from "./ServerSection "
import { ServerChannel } from "./ServerChannel "
import { ServerSearch } from "./ServerSearch"
import { ServerHeader } from "./ServerHeader"
import { ServerMember } from "./ServerMember"
import { redirect } from "next/navigation"
import { db } from "@/lib/prisma"

interface ServerSidebarProps {
    serverId: string
}

const iconMap = {
    [ChannelType.TEXT]: <Hash className="h-4 w-4 mr-2" />,
    [ChannelType.AUDIO]: <Mic className="h-4 w-4 mr-2" />,
    [ChannelType.VIDEO]: <Video className="h-4 w-4 mr-2" />,
}

const roleIocnMap = {
    [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />,
    [MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />,
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
                {!!textChannels?.length && (
                    <div className="mb-2">
                        <ServerSection
                            sectionType="channels"
                            channelType={ChannelType.TEXT}
                            role={role}
                            label="Text Channels"
                        />
                        {textChannels.map((channel) => (
                            <ServerChannel
                                key={channel.id}
                                channel={channel}
                                role={role}
                                server={server}
                            />
                        ))}
                    </div>
                )}
                {!!audioChannels?.length && (
                    <div className="mb-2">
                        <ServerSection
                            sectionType="channels"
                            channelType={ChannelType.AUDIO}
                            role={role}
                            label="Voice Channels"
                        />
                        {audioChannels.map((channel) => (
                            <ServerChannel
                                key={channel.id}
                                channel={channel}
                                role={role}
                                server={server}
                            />
                        ))}
                    </div>
                )}
                {!!videohannels?.length && (
                    <div className="mb-2">
                        <ServerSection
                            sectionType="channels"
                            channelType={ChannelType.VIDEO}
                            role={role}
                            label="Video Channels"
                        />
                        {videohannels.map((channel) => (
                            <ServerChannel
                                key={channel.id}
                                channel={channel}
                                role={role}
                                server={server}
                            />
                        ))}
                    </div>
                )}
                {!!memebers?.length && (
                    <div className="mb-2">
                        <ServerSection
                            sectionType="members"
                            role={role}
                            label="Members"
                            server={server}
                        />
                        {memebers.map((member) => (
                            <ServerMember
                                key={member.id}
                                member={member}
                                server={server}
                            />
                        ))}
                    </div>
                )}
            </ScrollArea>
        </div>
    )
}
