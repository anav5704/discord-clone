import { ChatHeader } from "@/components/chat/ChatHeader"
import { ChatInput } from "@/components/chat/ChatInput"
import { currentProfile } from "@/lib/currentProfile"
import { redirectToSignIn } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { db } from "@/lib/prisma"

interface ChannelIdPageProps {
    params: {
        channelId: string,
        serverId: string,
    }
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
    const profile = await currentProfile()
    if (!profile) return redirectToSignIn()

    const channel = await db.channel.findUnique({
        where: {
            id: params.channelId
        }
    })

    const member = await db.member.findFirst({
        where: {
            serverId: params.serverId,
            profileId: profile.id,
        }
    })

    if (!channel || !member) redirect("/")

    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader serverId={channel.serverId} type="channel" name={channel.name} />
            <div className="flex-1">
                Future messages
            </div>
            <ChatInput name={channel.name} type="channel" apiUrl="/api/socket/messages" query={{ channelId: channel.id, serverId: channel.serverId }} />
        </div>
    )
}

export default ChannelIdPage