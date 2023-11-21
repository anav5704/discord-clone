import { InitialModal } from "@/components/modals/InitialModal"
import { redirect } from "next/navigation"
import { initUser } from "@/lib/initUser"
import { db } from "@/lib/prisma"

export default async function SetupPage() {
    const profile = await initUser()
    const server = await db.server.findFirst({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    })

    if (server) return redirect(`/servers/${server.id}`)

    return (
        <>
           <InitialModal /> 
        </>
    )
}