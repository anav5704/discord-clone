
import { currentProfile } from "@/lib/currentProfile";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const { name, type } = await req.json()
        const serverId = searchParams.get("serverId")
        const profile = await currentProfile()

        if (!profile) return new NextResponse("Unauthorized", { status: 401 })
        if (!serverId) return new NextResponse("Server id is missing", { status: 400 })
        if (name === "general") return new NextResponse("Name cannot be general", { status: 400 })

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
                    create: {
                        profileId: profile.id,
                        name,
                        type,
                    }
                }
            }
        })

        return NextResponse.json(server)

    } catch (error) {
        console.log("CHANNELS_POST", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}