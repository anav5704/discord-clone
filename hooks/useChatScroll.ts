import { useEffect, useState } from "react"

type ChatScrollProps = {
    chatRef: React.RefObject<HTMLDivElement>,
    bottomRef: React.RefObject<HTMLDivElement>,
    shoulLoadMore: boolean,
    loadMore: () => void,
    count: number
}

export const useChatScroll = ({ chatRef, bottomRef, shoulLoadMore, loadMore, count }: ChatScrollProps) => {
    const [hasInitialised, setHasInitialised] = useState(false)

    useEffect(() => {
        const topDiv = chatRef.current

        const handleScroll = () => {
            const scrollTop = topDiv?.scrollTop
            if (scrollTop === 9 && shoulLoadMore) loadMore()
        }

        topDiv?.addEventListener("scroll", handleScroll)

        return () => topDiv?.removeEventListener("scroll", handleScroll)
    }, [shoulLoadMore, loadMore, chatRef])

    useEffect(() => {
        const topDiv = chatRef.current
        const bottomDiv = bottomRef.current

        const shouldAutoScroll = () => {
            if (!hasInitialised && bottomDiv) {
                setHasInitialised(true)
                return true
            }

            if (!topDiv) return false

            const distanceFromBottom = topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight
            return distanceFromBottom <= 100
        }

        if (shouldAutoScroll()) {
            setTimeout(() => {
                bottomRef.current?.scrollIntoView({
                    behavior: "smooth"
                })
            }, 100);
        }
        
    }, [bottomRef, chatRef, count, hasInitialised])
}