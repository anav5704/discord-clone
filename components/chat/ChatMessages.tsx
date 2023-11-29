"use client"

import { Member, Message, Profile } from "@prisma/client"
import { useChatSocket } from "@/hooks/useChatSocket"
import { useChatQuery } from "@/hooks/useChatQuery"
import { Fragment, useRef, ElementRef } from "react"
import { Loader2, ServerCrash } from "lucide-react"
import { ChatWelcome } from "./ChatWelcome"
import { Borel, Gruppo } from "next/font/google"
import { ChatItem } from "./ChatItem"
import { format } from "date-fns"
import { useChatScroll } from "@/hooks/useChatScroll"

const DATE_FORMAT = "d MMM yyyy, HH:mm"

type MessaageWithMemberWithProfile = Message & {
    member: Member & {
        profile: Profile
    }
}

interface ChatMessagesProps {
    name: string,
    member: Member,
    chatId: string,
    apiUrl: string,
    socketUrl: string,
    socketQuery: Record<string, string>,
    paramKey: "channelId" | "conversationId",
    paramValue: string,
    type: "channel" | "conversation"
}

export const ChatMessages = ({ name, member, chatId, apiUrl, socketUrl, socketQuery, paramKey, paramValue, type }: ChatMessagesProps) => {
    const queryKey = `chat:$${chatId}`
    const addKey = `chat:${chatId}:messages`
    const updateKey = `chat:${chatId}:messages:update`

    const chatRef = useRef<ElementRef<"div">>(null)
    const bottomRef = useRef<ElementRef<"div">>(null)

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useChatQuery({
        queryKey,
        apiUrl,
        paramKey,
        paramValue
    })

    useChatSocket({ queryKey, addKey, updateKey })
    useChatScroll({ chatRef, bottomRef, loadMore: fetchNextPage, shoulLoadMore: !isFetchingNextPage && !!hasNextPage, count: data?.pages[0]?.items?.length ?? 0 })

    if (status === "pending") {
        return (
            <div className="flex flex-1 flex-col items-center justify-center">
                <Loader2 className="w-7 h-7 text-zinc-500 animate-spin my-4" />
                <p className="text-xs text-zinc-500">Loading messages ...</p>
            </div>
        )
    }

    if (status === "error") {
        return (
            <div className="flex flex-1 flex-col items-center justify-center">
                <ServerCrash className="w-7 h-7 text-zinc-500 my-4" />
                <p className="text-xs text-zinc-500">Something went wrnog</p>
            </div>
        )
    }

    return (
        <div ref={chatRef} className="flex-1 flex flex-col py-4 overflow-y-auto">
            {!hasNextPage && (<div className="flex-1 " />)}
            {!hasNextPage && (<ChatWelcome type={type} name={name} />)}
            {hasNextPage && (
            <div className="flex justify-center">
                {isFetchingNextPage ? (
                    <Loader2 className="w-7 h-7 text-zinc-500 animate-spin my-4" />
                ) : (
                    <button onClick={() => fetchNextPage()} className="text-zinc-500 text-xs my-4">Load more</button>
                )}
            </div>
            )}
            <div className="flex flex-col-reverse mt-auto">
                {data?.pages?.map((group: any, i) => (
                    <Fragment key={i}>
                        {group.items.map((message: MessaageWithMemberWithProfile) => (
                            <ChatItem
                                key={message.id}
                                currentMember={member}
                                member={message.member}
                                id={message.id}
                                content={message.content}
                                fileUrl={message.fileUrl}
                                deleted={message.deleted}
                                isUpdated={message.createdAt !== message.updatedAt}
                                socketUrl={socketUrl}
                                socketQuery={socketQuery}
                            />
                        ))}
                    </Fragment>
                ))}
            </div>
            <div ref={bottomRef} />
        </div>
    )
}
