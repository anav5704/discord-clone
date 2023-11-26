"use client"

import { EditChannelModal } from "@/components/modals/EditChannelModal copy"
import { CreateChannelModal } from "@/components/modals/CreateChannelModal"
import { DeleteChannelModal } from "@/components/modals/DeleteChannelModal"
import { CreateServerModal } from "@/components/modals/CreateServerModal"
import { DeleteServerModal } from "@/components/modals/DeleteServerModal"
import { LeaveServerModal } from "@/components/modals/LeaveServerModal"
import { EditServerModal } from "@/components/modals/EditServerModal"
import { MembersModal } from "@/components/modals/MembersModal"
import { InviteModal } from "@/components/modals/InviteModal"
import { useEffect, useState } from "react"

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) return null

    return (
        <>
            <CreateServerModal />
            <InviteModal />
            <EditServerModal />
            <MembersModal />
            <CreateChannelModal />
            <LeaveServerModal />
            <DeleteServerModal />
            <DeleteChannelModal />
            <EditChannelModal />
        </>
    )
}