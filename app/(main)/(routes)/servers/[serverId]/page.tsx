import { currentProfile } from "@/lib/currentProfile"
import { redirectToSignIn } from "@clerk/nextjs"
import { db } from "@/lib/prisma"
import { redirect } from "next/navigation"

interface ServerPageProps {
    params: {
        serverId: string
    }
}

const ServerPage = async ({ params }: ServerPageProps) => {
    const profile = await currentProfile()
    if (!profile) return redirectToSignIn()

    const server = await db.server.findUnique({
        where: {
            id: params.serverId,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        },
        include: {
            channels: {
                where: {
                    name: "General"
                },
                orderBy: {
                    createdAt: "asc"
                }
            }
        }
    })

    const initialChannel = server?.channels[0]

    if (initialChannel?.name !== "General") return null

    return redirect(`/servers/${params.serverId}/channels/${initialChannel.id}`)
}

export default ServerPage