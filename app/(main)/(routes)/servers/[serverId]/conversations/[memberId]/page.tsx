import { getOrCreateConversation } from "@/lib/conversation"
import { currentProfile } from "@/lib/currentProfile"
import { redirectToSignIn } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { db } from "@/lib/prisma"
import { ChatHeader } from "@/components/chat/ChatHeader"
import { ChatMessages } from "@/components/chat/ChatMessages"
import { ChatInput } from "@/components/chat/ChatInput"
import { MediaRoom } from "@/components/MediaRoom"

interface MemberIdPageProps {
    params: {
        memberId: string,
        serverId: string,
    },
    searchParams: {
        video?: boolean
    }
}

const memberIdPage = async ({ params, searchParams }: MemberIdPageProps) => {
    const profile = await currentProfile()
    if (!profile) return redirectToSignIn()

    const currrentMember = await db.member.findFirst({
        where: {
            serverId: params.serverId,
            profileId: profile.id
        },
        include: {
            profile: true
        }
    })
    if (!currrentMember) return redirect("/")

    const conversation = await getOrCreateConversation(currrentMember.id, params.memberId)
    if (!conversation) return redirect(`/servers/${params.serverId}`)

    const { memberOne, memberTwo } = conversation
    const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne

    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader imageUrl={otherMember.profile.imageUrl} name={otherMember.profile.name} serverId={params.serverId} type="conversation" />
            {searchParams.video && (
                <MediaRoom chatId={conversation.id} video={true} audio={true}/>
            )}
            {!searchParams.video && (
                <>
                    <ChatMessages
                        member={currrentMember}
                        name={otherMember.profile.name}
                        chatId={conversation.id}
                        type="conversation"
                        apiUrl="/api/direct-messages"
                        paramKey="conversationId"
                        paramValue={conversation.id}
                        socketUrl="/api/socket/direct-messages"
                        socketQuery={{
                            conversationId: conversation.id,
                        }}
                    />
                    <ChatInput
                        name={otherMember.profile.name}
                        type="conversation"
                        apiUrl="/api/socket/direct-messages"
                        query={{
                            conversationId: conversation.id,
                        }}
                    />
                </>
            )}
        </div>
    )
}

export default memberIdPage