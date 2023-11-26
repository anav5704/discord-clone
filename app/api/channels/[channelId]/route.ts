import { currentProfile } from "@/lib/currentProfile"
import { MemberRole } from "@prisma/client"
import { NextResponse } from "next/server"
import { db } from "@/lib/prisma"

export async function DELETE(req: Request, { params }: { params: { channelId: string } }) {
    try {
        const profile = await currentProfile()
        const { searchParams } = new URL(req.url)
        const serverId = searchParams.get("serverId")

        if (!profile) return new NextResponse("Unauthorized", { status: 401 })
        if (!serverId) return new NextResponse("Server id is missing", { status: 400 })
        if (!params.channelId) return new NextResponse("Channel id is missing", { status: 400 })

        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data: {
                channels: {
                    delete: {
                        id: params.channelId,
                        name: {
                            not: "General"
                        }
                    }
                }
            }
        })

        return NextResponse.json(server)
    } catch (error) {
        console.log("CHANNEL_ID_DELETE", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function PATCH(req: Request, { params }: { params: { channelId: string } }) {
    try {
        const profile = await currentProfile()
        const { searchParams } = new URL(req.url)
        const { name, type } = await req.json()
        const serverId = searchParams.get("serverId")

        if (!profile) return new NextResponse("Unauthorized", { status: 401 })
        if (!serverId) return new NextResponse("Server id is missing", { status: 400 })
        if (!params.channelId) return new NextResponse("Channel id is missing", { status: 400 })
        if (name === "General") return new NextResponse("Name cannot be General", { status: 400 })

        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data: {
                channels: {
                    update: {
                        where: {
                            id: params.channelId,
                            NOT: {
                                name: "General"
                            }
                        },
                        data: { 
                            name,
                            type
                        }
                    }
                }
            }
        })

        return NextResponse.json(server)
    } catch (error) {
        console.log("CHANNEL_ID_PATCH", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}