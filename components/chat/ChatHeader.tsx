import { MobileToggle } from "@/components/ui/MobileToggle"
import { Hash, Menu } from "lucide-react"
import { UserAvatar } from "../UserAvatar "

interface ChatHeaderProps {
    serverId: string,
    name: string,
    type: "channel" | "conversation",
    imageUrl?: string,
}

export const ChatHeader = ({ serverId, name, type, imageUrl }: ChatHeaderProps) => {
    return (
        <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-700 border-b-2">
            <MobileToggle serverId={serverId} />
            {type === "channel" && (
                <Hash className="h-5 w-5 text-zinc-500 mr-2k" />
            )}
            {type === "conversation" && (
                <UserAvatar src={imageUrl} className="h-8 w-8 mr-2 md:h-8 md:w-8" />
            )}
            <p className="font-semibold text-md text-black dark:text-white">{name}</p>
        </div>
    )
}
