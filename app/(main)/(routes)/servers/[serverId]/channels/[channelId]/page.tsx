import { ChatMessages } from "@/components/chat/ChatMessages"
import { ChatHeader } from "@/components/chat/ChatHeader"
import { ChatInput } from "@/components/chat/ChatInput"
import { currentProfile } from "@/lib/currentProfile"
import { redirectToSignIn } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { db } from "@/lib/prisma"
import { ChannelType } from "@prisma/client"
import { MediaRoom } from "@/components/MediaRoom"

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
            {channel.type === ChannelType.TEXT && (
                <>
                    <ChatMessages
                        member={member}
                        name={channel.name}
                        chatId={channel.id}
                        type="channel"
                        apiUrl="/api/messages"
                        socketUrl="/api/socket/messages"
                        paramKey="channelId"
                        paramValue={channel.id}
                        socketQuery={{
                            channelId: channel.id,
                            serverId: channel.serverId
                        }}
                    />
                    <ChatInput name={channel.name} type="channel" apiUrl="/api/socket/messages" query={{ channelId: channel.id, serverId: channel.serverId }} />
                </>
            )}
            {channel.type === ChannelType.AUDIO && (
                <MediaRoom chatId={channel.id} video={false} audio={true} />
            )}
            {channel.type === ChannelType.VIDEO && (
                <MediaRoom chatId={channel.id} video={true} audio={true} />
            )}
        </div>
    )
}

export default ChannelIdPage