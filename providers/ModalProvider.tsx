"use client"

import { CreateChannelModal } from "@/components/modals/CreateChannelModal"
import { CreateServerModal } from "@/components/modals/CreateServerModal"
import { LeaveServerModal } from "@/components/modals/LeaveServerModal"
import { EditServerModal } from "@/components/modals/EditServerModal"
import { MembersModal } from "@/components/modals/MembersModal"
import { InviteModal } from "@/components/modals/InviteModal"
import { useEffect, useState } from "react"
import { DeleteServerModal } from "@/components/modals/DeleteServerModal"

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
        </>
    )
}